<template>
  <div class="welcome-screen">
    <img src="~@/renderer/ui/assets/images/yaht-logo.svg" class="yaht-logo" />
    <div class="login-wrapper" v-if="!isLoggedIn">
      <h1 class="mt-6 text-center text-3xl font-extrabold">
        Sign in to your account
      </h1>
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <div class="space-y-6">
            <div class="field">
              <div class="mt-1">
                <label for="userName">E-Mail / Username</label>
                <input id="userName" type="text" v-model="userName" />
              </div>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <div class="mt-1">
                <input id="password" type="password" v-model="password" />
              </div>
            </div>
            <button class="btn btn-primary w-full" @click="loginClicked">
              <img
                src="~@/renderer/ui/assets/images/spinner.svg"
                v-if="isLoggingIn"
                class="animate-spin"
              />
              <template v-else>Log in</template>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="temporary-user-wrapper" v-else>
      <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Welcome, {{ user.username }}!
      </h1>

      <button class="btn btn-primary w-full mt-5" @click="logoutClicked">
        Log out
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import SERVICE from '@/constants/ServiceIdentifiers';
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/renderer/core/auth/AuthUseCases';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { ExperienceSamplingUseCases } from '@/renderer/core/experience-sampling/ExperienceSamplingUseCases';
import { BasicNotification } from '@/renderer/core/notification/models/BasicNotification';
import { NotificationUseCases } from '@/renderer/core/notification/NotificationUseCases';
import { OccurrenceUseCases } from '@/renderer/core/occurrence/OccurrenceUseCases';
import { UserUseCases } from '@/renderer/core/user/UserUseCases';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { getLogger } from '@/shared/logger';
import { ipcRenderer, IpcRendererEvent, remote } from 'electron';
import { DateTime } from 'luxon';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const LOG = getLogger('Home');
const auth = namespace('authStore');

@Component({
  components: {},
})
export default class Home extends Vue {
  private authUseCase: AuthUseCases;
  private userUseCase: UserUseCases;
  private notificationUseCase: NotificationUseCases;
  private occurrenceUseCase: OccurrenceUseCases;
  private experienceSamplingUseCase: ExperienceSamplingUseCases;
  private httpService: HttpService;

  private isLoggingIn = false;
  private isFetchingNotifications = false;
  private fetchNotificationsInterval: number | undefined;
  private userName = 'sebastian.richner@uzh.ch';
  public password = '';

  @auth.State isLoggedIn!: boolean;
  @auth.State user!: UserAuthDTO;

  constructor() {
    super();
    this.authUseCase = this.$container.get(USE_CASE.AUTH);
    this.userUseCase = this.$container.get(USE_CASE.USER);
    this.notificationUseCase = this.$container.get(USE_CASE.NOTIFICATION);
    this.occurrenceUseCase = this.$container.get(USE_CASE.OCCURRENCE);
    this.experienceSamplingUseCase = this.$container.get(
      USE_CASE.EXPERIENCE_SAMPLING
    );
    this.httpService = this.$container.get(SERVICE.HTTP);
  }

  created(): void {
    ipcRenderer.on('notification-skipped', this.handleSkippedNotification);
    ipcRenderer.on('notification-started', this.handleStartedNotification);
    ipcRenderer.on('notification-ended', this.handleEndedNotification);
    ipcRenderer.on('fetch-notifications', this.fetchNotifications);
  }

  async loginClicked(): Promise<void> {
    LOG.info('Login clicked...');
    this.isLoggingIn = true;
    try {
      await this.authUseCase.login(this.userName, this.password);
      const mainWindow = await remote.BrowserWindow.getFocusedWindow();
      if (process.env.NODE_ENV === 'production' && mainWindow) {
        mainWindow.hide();
      }

      await this.fetchNotifications();
      this.fetchNotificationsInterval = window.setInterval(
        this.fetchNotifications,
        5 * 60 * 1000
      );
    } catch (e) {
      LOG.error(e);
    }
    this.isLoggingIn = false;
  }

  async fetchNotifications(): Promise<void> {
    if (this.isFetchingNotifications) {
      LOG.info(
        'fetchNotifications called, already fetching notifications, skipping...'
      );
      ipcRenderer.send('fetch-notifications-answer', false);
      return;
    }
    if (!this.isLoggedIn) {
      LOG.error('fetchNotifications called, user not logged in, skipping...');
      ipcRenderer.send('fetch-notifications-answer', false);
      return;
    }
    LOG.info('fetchNotifications called, fetching notifications...');
    this.isFetchingNotifications = true;
    const occurrences = await this.occurrenceUseCase.getOccurrencesForUser(
      this.user.id
    );
    const occurrenceNotifications = this.notificationUseCase.createNotificationsFromOccurrences(
      occurrences
    );
    const reflectionNotifications = this.notificationUseCase.createNotificationsFromReflections(
      this.user
    );
    const experienceSamples = await this.experienceSamplingUseCase.getExperienceSamplingsForUser(
      this.user.id
    );

    const allNotifications = occurrenceNotifications.concat(
      reflectionNotifications
    );
    this.isFetchingNotifications = false;
    ipcRenderer.send('fetch-notifications-answer', true);

    if (allNotifications) {
      LOG.debug(
        `Notifications loaded in Home, length=${allNotifications.length}`
      );
      ipcRenderer.send('notifications', allNotifications);
      ipcRenderer.send('experience-samples', experienceSamples);
    }
  }

  async handleSkippedNotification(
    event: IpcRendererEvent,
    notification: BasicNotification
  ): Promise<void> {
    LOG.info(
      `Received notification-skipped for Notification=${notification.title}}`
    );
    try {
      await this.occurrenceUseCase.updateOccurrenceSkippedAt(
        this.user.id,
        notification.occurrenceId!,
        DateTime.fromISO(notification.skippedAt!).toString()
      );
    } catch (e) {
      LOG.error(e);
    }
  }

  async handleStartedNotification(
    event: IpcRendererEvent,
    notification: BasicNotification
  ): Promise<void> {
    LOG.info(
      `Received notification-started for Notification=${notification.title}`
    );
    try {
      await this.occurrenceUseCase.updateOccurrenceStartedAt(
        this.user.id,
        notification.occurrenceId!,
        DateTime.fromISO(notification.startedAt!).toString()
      );
    } catch (e) {
      LOG.error(e);
    }
  }

  async handleEndedNotification(
    event: IpcRendererEvent,
    notification: BasicNotification
  ): Promise<void> {
    LOG.info(
      `Received notification-ended for Notification=${notification.title}}`
    );
    try {
      await this.occurrenceUseCase.updateOccurrenceEndedAt(
        this.user.id,
        notification.occurrenceId!,
        DateTime.fromISO(notification.endedAt!).toString()
      );
    } catch (e) {
      LOG.error(e);
    }
  }

  logoutClicked(): void {
    clearInterval(this.fetchNotificationsInterval);
    this.isFetchingNotifications = false;
    ipcRenderer.send('logout');
    this.authUseCase.logout();
  }
}
</script>

<style lang="scss" scoped>
.welcome-screen {
  @apply min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 p-5 relative;

  .yaht-logo {
    @apply absolute top-10 left-1/2 transform -translate-x-1/2;
    width: 120px;
  }
}
</style>
