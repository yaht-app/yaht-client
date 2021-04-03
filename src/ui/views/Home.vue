<template>
  <div>
    {{ isLoggedIn }}
    <a @click="loginClicked">LOGIN</a>
    <a @click="logoutClicked">LOGOUT</a>
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
