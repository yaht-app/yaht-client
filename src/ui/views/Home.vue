<template>
  <div class="home">
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

          {{ isLoggedIn }}
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
</template>

<script lang="ts">
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/core/auth/AuthUseCases';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const auth = namespace('authStore');

@Component({
  components: {},
})
export default class Home extends Vue {
  private authUseCase: AuthUseCases;
  public userName = 'sebastian.richner@uzh.ch';
  public password = '';

  @auth.State isLoggedIn!: boolean;

  constructor() {
    super();
    this.authUseCase = this.$container.get(USE_CASE.AUTH);
  }

  loginClicked(): void {
    this.authUseCase.login('userName', 'p@55w0rD');
  }

  logoutClicked(): void {
    this.authUseCase.logout();
  }
}
</script>

<style lang="scss" scoped>
.home {
  @apply min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 p-5;
}
</style>
