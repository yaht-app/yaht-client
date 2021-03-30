<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    {{ isLoggedIn }}
    <a @click="loginClicked">LOGIN</a>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/core/auth/AuthUseCases';
import HelloWorld from '@/ui/components/HelloWorld.vue';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const auth = namespace('authStore');

@Component({
  components: {
    HelloWorld,
  },
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
}
</script>
