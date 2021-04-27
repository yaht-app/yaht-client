<template>
  <div class="reflection-notification">
    <h1>Reflection Notification</h1>
    <h2></h2>
  </div>
</template>

<script lang="ts">
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/renderer/core/auth/AuthUseCases';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO';
import { ReflectionUseCases } from '@/renderer/core/reflection/ReflectionUseCases';
import { getLogger } from '@/shared/logger';
import { remote } from 'electron';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const LOG = getLogger('ReflectionNotification.vue');
const auth = namespace('authStore');

@Component({
  components: {},
})
export default class ReflectionNotification extends Vue {
  private authUseCase: AuthUseCases;
  private reflectionUseCase: ReflectionUseCases;
  private isLoading = true;

  @auth.State isLoggedIn!: boolean;
  @auth.State user!: UserAuthDTO;

  constructor() {
    super();
    this.authUseCase = this.$container.get(USE_CASE.AUTH);
    this.reflectionUseCase = this.$container.get(USE_CASE.REFLECTION);
  }

  async created(): Promise<void> {
    await this.authUseCase.setAuthFromUserAuthDTO(
      await remote.getGlobal('user')
    );
    this.isLoading = true;
    await this.reflectionUseCase.getMockReflectionData();
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.reflection-notification {
  padding: 5px 15px;
}
</style>
