<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <a @click="loginClicked">LOGIN</a>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import SERVICE from '@/constants/ServiceIdentifiers';
import { AuthService } from '@/services/auth/AuthService';
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = this.$container.get(SERVICE.AUTH);
  }

  loginClicked(): void {
    this.authService.login('userName', 'p@55w0rD');
  }
}
</script>
