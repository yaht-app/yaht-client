<template>
  <div class="reflection-notification">
    <h1>Reflection Notification</h1>
    <template v-if="!isLoading">
      <h2>{{ reflectionData.title }}</h2>
      <h3>{{ reflectionData.openTextTitle }}</h3>
      <textarea />
      <button class="btn btn-primary w-full">Submit</button>
      {{ habitAnswers }}
      <div
        class="flex flex-col"
        v-for="habit in reflectionData.habits"
        :key="habit.title"
      >
        <h3>{{ habit.title }}</h3>
        <div class="habit-rating flex flex-row items-center">
          <div
            v-for="(answer, index) in possibleHabitAnswers"
            :key="habit.title + '-' + answer"
          >
            <label>
              <input
                :id="index"
                type="radio"
                class="mx-2 my-1"
                v-model="habitAnswers[habit.id]"
                :name="habit.id"
                :value="index"
                :key="habit.title + '-' + answer"
              />
              {{ answer }} ( {{ index }} )</label
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/renderer/core/auth/AuthUseCases';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO';
import { Reflection } from '@/renderer/core/reflection/models/Reflection';
import { ReflectionUseCases } from '@/renderer/core/reflection/ReflectionUseCases';
import { getLogger } from '@/shared/logger';
import { remote } from 'electron';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const LOG = getLogger('ExperienceNotification.vue');
const auth = namespace('authStore');

@Component({
  components: {},
})
export default class ExperienceNotification extends Vue {
  private authUseCase: AuthUseCases;
  private reflectionUseCase: ReflectionUseCases;
  private reflectionData: Reflection | undefined;
  private reflectionAnswers: any;
  private habitAnswers = {};
  private isLoading = true;
  private currentHabit = 0;

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
    this.reflectionData = await this.reflectionUseCase.getMockReflectionData();
    this.isLoading = false;
  }

  goToNextHabit(): void {
    this.currentHabit++;
  }

  get possibleHabitAnswers() {
    return ['Not at all', 'Not much', `I don't know`, 'A bit', 'Definitely'];
  }
}
</script>

<style lang="scss" scoped>
.reflection-notification {
  padding: 5px 15px;

  .habit-rating {
    @apply text-sm;
  }
}
</style>
