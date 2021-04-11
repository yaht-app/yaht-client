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
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/renderer/core/auth/AuthUseCases';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { Occurrence } from '@/renderer/core/occurrence/models/Occurrence';
import { OccurrenceUseCases } from '@/renderer/core/occurrence/OccurrenceUseCases';
import { UserUseCases } from '@/renderer/core/user/UserUseCases';
import { getLogger } from '@/shared/logger';
import { ipcRenderer } from 'electron';
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
  private occurrenceUseCase: OccurrenceUseCases;

  public isLoggingIn = false;
  public userName = 'sebastian.richner@uzh.ch';
  public password = '';

  @auth.State isLoggedIn!: boolean;
  @auth.State user!: UserAuthDTO;

  constructor() {
    super();
    this.authUseCase = this.$container.get(USE_CASE.AUTH);
    this.userUseCase = this.$container.get(USE_CASE.USER);
    this.occurrenceUseCase = this.$container.get(USE_CASE.OCCURRENCE);
  }

  async loginClicked(): Promise<void> {
    LOG.info('Login clicked...');
    this.isLoggingIn = true;
    try {
      await this.authUseCase.login(this.userName, this.password);
      ipcRenderer.send('from-renderer', `Welcome, ${this.user.username} !`);
      const notifications = await this.occurrenceUseCase.getOccurrencesForUser(
        this.user.id
      );
      LOG.debug('Notifications loaded: ', notifications);

      ipcRenderer.send('notifications', this.getMockNotifications());
    } catch (e) {
      LOG.error(e);
    }
    this.isLoggingIn = false;
  }

  private getMockNotifications(): Occurrence[] {
    return [
      {
        id: 249,
        scheduled_at: '2021-04-10T16:06:40.000Z',
        started_at: null,
        ended_at: null,
        skipped_at: null,
        habit: {
          id: 4,
          title: 'testing',
          duration: 5,
          is_skippable: false,
        },
      },
      {
        id: 250,
        scheduled_at: '2021-04-11T16:06:40.000Z',
        started_at: null,
        ended_at: null,
        skipped_at: null,
        habit: {
          id: 4,
          title: 'testing',
          duration: 5,
          is_skippable: false,
        },
      },
      {
        id: 251,
        scheduled_at: '2021-04-12T16:06:40.000Z',
        started_at: null,
        ended_at: null,
        skipped_at: null,
        habit: {
          id: 4,
          title: 'testing',
          duration: 5,
          is_skippable: false,
        },
      },
      {
        id: 252,
        scheduled_at: '2021-04-13T16:06:40.000Z',
        started_at: null,
        ended_at: null,
        skipped_at: null,
        habit: {
          id: 4,
          title: 'testing',
          duration: 5,
          is_skippable: false,
        },
      },
      {
        id: 253,
        scheduled_at: '2021-04-14T16:06:40.000Z',
        started_at: null,
        ended_at: null,
        skipped_at: null,
        habit: {
          id: 4,
          title: 'testing',
          duration: 5,
          is_skippable: false,
        },
      },
      {
        id: 254,
        scheduled_at: '2021-04-15T16:06:40.000Z',
        started_at: null,
        ended_at: null,
        skipped_at: null,
        habit: {
          id: 4,
          title: 'testing',
          duration: 5,
          is_skippable: false,
        },
      },
      {
        id: 255,
        scheduled_at: '2021-04-16T16:06:40.000Z',
        started_at: null,
        ended_at: null,
        skipped_at: null,
        habit: {
          id: 4,
          title: 'testing',
          duration: 5,
          is_skippable: false,
        },
      },
    ];
  }

  logoutClicked(): void {
    ipcRenderer.send('logout');
    this.authUseCase.logout();
  }
}
</script>

<style lang="scss" scoped>
.welcome-screen {
  @apply min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 p-5 relative;

  .yaht-logo {
    @apply absolute top-10 left-1/2 transform -translate-x-1/2 opacity-70 transition-opacity hover:opacity-100;
    width: 120px;
  }
}
</style>
