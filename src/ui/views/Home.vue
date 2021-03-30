<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    {{ isLoggedIn }}
    <a @click="loginClicked">LOGIN</a>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import SERVICE from '@/constants/ServiceIdentifiers';
import { AuthService } from '@/core/auth/AuthService';
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
  private authService: AuthService;

  @auth.State isLoggedIn!: boolean;

  constructor() {
    super();
    this.authService = this.$container.get(SERVICE.AUTH);
  }

  loginClicked(): void {
    this.authService.login('userName', 'p@55w0rD');
  }
}
</script>
