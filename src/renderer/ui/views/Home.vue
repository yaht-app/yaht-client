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
      LOG.warn(await this.occurrenceUseCase.getOccurrenceForUser(this.user.id));
      ipcRenderer.send('from-renderer', `Welcome, ${this.user.username} !`);
    } catch (e) {
      LOG.error(e);
    }
    this.isLoggingIn = false;
    const notifications = this.getMockNotifications();
    ipcRenderer.send('notifications', notifications);
  }

  private getMockNotifications(): Occurrence[] {
    return [
      {
        id: 249,
        scheduled_at: '2021-04-10T00:15:00.000Z',
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
        scheduled_at: '2021-04-11T00:15:00.000Z',
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
        scheduled_at: '2021-04-12T00:15:00.000Z',
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
        scheduled_at: '2021-04-13T00:15:00.000Z',
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
        scheduled_at: '2021-04-14T00:15:00.000Z',
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
        scheduled_at: '2021-04-15T00:15:00.000Z',
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
        scheduled_at: '2021-04-16T00:15:00.000Z',
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
  @apply min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 p-5;
}
</style>
