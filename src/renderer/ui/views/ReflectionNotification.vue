<template>
  <div class="reflection-notification">
    <h1>Reflection Notification</h1>
  </div>
</template>

<script lang="ts">
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/renderer/core/auth/AuthUseCases';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO';
import { OccurrenceUseCases } from '@/renderer/core/occurrence/OccurrenceUseCases';
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
  private occurrenceUseCase: OccurrenceUseCases;
  private isLoading = true;

  @auth.State isLoggedIn!: boolean;
  @auth.State user!: UserAuthDTO;

  constructor() {
    super();
    this.authUseCase = this.$container.get(USE_CASE.AUTH);
    this.occurrenceUseCase = this.$container.get(USE_CASE.OCCURRENCE);
  }

  async created() {
    this.authUseCase.setAuthFromUserAuthDTO(await remote.getGlobal('user'));
    this.isLoading = true;
    await this.createMockReflectionData();
    this.isLoading = false;
  }

  createMockReflectionData() {
    setTimeout(() => {
      return {
        title: 'It’s time for your weekly reflection.',
        openTextTitle:
          'Reflecting will help you to identify which of your habits are helping you towards achieving your goals.',
        goalQuestion:
          'Do you think that the following habits have worked towards achieving your goal to My awesome goal!?',
        habits: [
          {
            title: 'awesome habit by sebastian',
          },
          {
            title: 'focusing',
          },
          {
            title: 'workday scheduling',
          },
        ],
      };
    }, 1500);
  }
}
</script>

<style lang="scss" scoped>
.reflection-notification {
  padding: 5px 15px;
}
</style>
