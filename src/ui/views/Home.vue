<template>
  <div class="welcome-screen">
    <div class="login-wrapper" v-if="!isLoggedIn">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <form class="space-y-6">
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
            <input
              type="button"
              value="Log in"
              class="btn btn-primary w-full"
              @click="loginClicked"
            />
          </form>
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
import { AuthUseCases } from '@/core/auth/AuthUseCases';
import { User } from '@/core/auth/models/User';
import { BasicNotification } from '@/core/notification/models/BasicNotification';
import { UserUseCases } from '@/core/user/UserUseCases';
import { ipcRenderer } from 'electron';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { DateTime } from 'luxon';
const auth = namespace('authStore');

@Component({
  components: {},
})
export default class Home extends Vue {
  private authUseCase: AuthUseCases;
  private userUseCase: UserUseCases;
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
    try {
      await this.authUseCase.login(this.userName, this.password);
      console.log(await this.userUseCase.getUserById(String(this.user.id)));
      ipcRenderer.send('from-renderer', `Welcome, ${this.user.username} !`);
    } catch (e) {
      console.error(e);
    }

    const notifications = this.getMockNotifications();
    ipcRenderer.send('notifications', notifications);
  }

  private getMockNotifications(): BasicNotification[] {
    const notifications = [
      {
        triggerTimeAndDate: DateTime.now().plus({ seconds: 5 }).toMillis(),
        title: 'Start stretching',
        message: 'Start stretching',
        sent: false,
        actions: [{ text: 'Start', type: 'button' }],
      },
      {
        triggerTimeAndDate: DateTime.now().plus({ seconds: 15 }).toMillis(),
        title: 'Start stretching',
        message: 'Start stretching',
        sent: false,
        actions: [
          { text: 'OK    ›', type: 'button' },
          { text: 'Skip', type: 'button' },
        ],
      },
      {
        triggerTimeAndDate: DateTime.now().plus({ seconds: 60 }).toMillis(),
        title: 'Start stretching',
        message: 'Start stretching',
        sent: false,
        actions: [
          { text: 'OK  ›', type: 'button' },
          { text: 'Skip', type: 'button' },
        ],
      },
      {
        triggerTimeAndDate: DateTime.now().plus({ seconds: 30 }).toMillis(),
        title: 'Start stretching',
        message: 'Start stretching',
        sent: false,
        actions: [
          { text: 'OK ›', type: 'button' },
          { text: 'Skip', type: 'button' },
        ],
      },
    ];
    return notifications;
  }

  logoutClicked(): void {
    this.authUseCase.logout();
  }
}
</script>

<style lang="scss" scoped>
.welcome-screen {
  @apply min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 p-5;
}
</style>
