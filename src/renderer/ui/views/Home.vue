<template>
  <div class="welcome-screen">
    <div class="login-wrapper" v-if="!isLoggedIn">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
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
                src="../assets/spinner.svg"
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
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Welcome, {{ user.username }}!
      </h2>

      <input
        type="button"
        value="Log out"
        class="btn btn-primary w-full mt-5"
        @click="logoutClicked"
      />
    </div>
  </div>
</template>

<script lang="ts">
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/renderer/core/auth/AuthUseCases';
import { User } from '@/renderer/core/auth/models/User';
import { BasicNotification } from '@/renderer/core/notification/models/BasicNotification';
import { UserUseCases } from '@/renderer/core/user/UserUseCases';
import { getLogger } from '@/shared/logger';
import { ipcRenderer } from 'electron';
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

  public isLoggingIn = false;
  public userName = 'sebastian.richner@uzh.ch';
  public password = '';

  @auth.State isLoggedIn!: boolean;
  @auth.State user!: User;

  constructor() {
    super();
    this.authUseCase = this.$container.get(USE_CASE.AUTH);
    this.userUseCase = this.$container.get(USE_CASE.USER);
  }

  async loginClicked(): Promise<void> {
    LOG.info('Login clicked...');
    this.isLoggingIn = true;
    try {
      await this.authUseCase.login(this.userName, this.password);
      LOG.debug(await this.userUseCase.getUserById(String(this.user.id)));
      ipcRenderer.send('from-renderer', `Welcome, ${this.user.username} !`);
    } catch (e) {
      LOG.error(e);
    }
    this.isLoggingIn = false;
    const notifications = this.getMockNotifications();
    ipcRenderer.send('notifications', notifications);
  }

  private getMockNotifications(): BasicNotification[] {
    return [
      {
        triggerTimeAndDate: DateTime.now().plus({ seconds: 5 }).toMillis(),
        title: 'Start stretching',
        message: 'Stretch for 2 minutes',
        sent: false,
        actions: [{ text: 'Start', type: 'button' }],
      },
      {
        triggerTimeAndDate: DateTime.now().plus({ seconds: 15 }).toMillis(),
        title: 'End stretching',
        message: 'You have stretched for 2 minutes',
        sent: false,
      },
      {
        triggerTimeAndDate: DateTime.now().plus({ seconds: 30 }).toMillis(),
        title: 'Start stretching',
        message: 'Start stretching',
        sent: false,
        actions: [
          { text: 'OK  ›', type: 'button' },
          { text: 'Skip', type: 'button' },
        ],
      },
      {
        triggerTimeAndDate: DateTime.now().plus({ seconds: 40 }).toMillis(),
        title: 'End stretching',
        message: 'You have stretched for 2 minutes',
        sent: false,
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
  @apply min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 p-5;
}
</style>
