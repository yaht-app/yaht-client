<template>
  <div class="experience-sampling-notification">
    <template v-if="!isLoading">
      {{ experienceSamplingConfig }}
      <div class="max-w-md w-full pointer-events-auto flex">
        <div class="w-0 flex-1 p-4">
          <div class="flex items-start">
            <div class="w-0 flex-1">
              <p class="font-medium text-gray-900">
                How productive did you feel in the last hour?
              </p>
              <div class="flex flex-row justify-between mt-2 -mx-2">
                <div class="sample-answer">
                  <span class="flex mx-auto font-medium">1</span>
                </div>
                <div class="sample-answer">
                  <span class="flex mx-auto font-medium">2</span>
                </div>
                <div class="sample-answer">
                  <span class="flex mx-auto font-medium">3</span>
                </div>
                <div class="sample-answer">
                  <span class="flex mx-auto font-medium">4</span>
                </div>
                <div class="sample-answer">
                  <span class="flex mx-auto font-medium">5</span>
                </div>
                <div class="sample-answer">
                  <span class="flex mx-auto font-medium">6</span>
                </div>
                <div class="sample-answer">
                  <span class="flex mx-auto font-medium">7</span>
                </div>
              </div>
              <div class="flex flex-row text-gray-400 text-sm mt-1">
                <div class="">not at all</div>
                <div class="mx-auto">moderately</div>
                <div class="">very</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex border-l border-gray-200">
          <button
            @click="onSkipClicked"
            class="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            Skip
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthUseCases } from '@/renderer/core/auth/AuthUseCases';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO';
import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample.ts';
import { ExperienceSamplingUseCases } from '@/renderer/core/experience-sampling/ExperienceSamplingUseCases';
import { getLogger } from '@/shared/logger';
import { ipcRenderer, remote } from 'electron';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const LOG = getLogger('ExperienceNotification.vue');
const auth = namespace('authStore');

@Component({
  components: {},
})
export default class ExperienceNotification extends Vue {
  private authUseCase: AuthUseCases;
  private experienceSamplingUseCase: ExperienceSamplingUseCases;
  private experienceSamplingConfig: ExperienceSample | undefined;
  private isLoading = true;

  @auth.State isLoggedIn!: boolean;
  @auth.State user!: UserAuthDTO;

  constructor() {
    super();
    this.authUseCase = this.$container.get(USE_CASE.AUTH);
    this.experienceSamplingUseCase = this.$container.get(
      USE_CASE.EXPERIENCE_SAMPLING
    );
  }

  async created(): Promise<void> {
    ipcRenderer.on('experience-sample', (event, experienceSample) => {
      this.experienceSamplingConfig = experienceSample;
    });

    await this.authUseCase.setAuthFromUserAuthDTO(
      await remote.getGlobal('user')
    );
    this.isLoading = true;
    this.isLoading = false;
  }

  async onSkipClicked(): Promise<void> {
    const window = await remote.BrowserWindow.getFocusedWindow();
    LOG.debug('Skip called, closing window...');
    if (window) {
      window.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.experience-sampling-notification {
  .sample-answer {
    @apply mx-2 flex w-8 h-8 bg-gray-100 text-center items-center text-gray-500 align-middle rounded-md border border-gray-200 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer transition-all;
  }
}
</style>
