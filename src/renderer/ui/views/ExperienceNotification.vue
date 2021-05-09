<template>
  <div class="experience-sampling-notification">
    <template v-if="experienceSampling">
      <div class="max-w-md w-full pointer-events-auto flex">
        <div class="w-0 flex-1 p-4">
          <div class="flex items-start">
            <div class="w-0 flex-1">
              <p class="prompt">
                {{ experienceSampling.config.prompt }}
              </p>
              <div class="flex flex-row justify-between mt-2 -mx-2">
                <div
                  class="sample-answer"
                  v-for="value in experienceSampling.config.scale.steps"
                  :key="value"
                >
                  <span
                    @click="onValueClicked(value)"
                    class="flex mx-auto font-medium"
                  >
                    {{ value }}
                  </span>
                </div>
              </div>
              <div class="flex flex-row text-gray-400 text-sm mt-1">
                <div class="">
                  {{ experienceSampling.config.scale.label_start }}
                </div>
                <div class="mx-auto">
                  {{ experienceSampling.config.scale.label_center }}
                </div>
                <div class="">
                  {{ experienceSampling.config.scale.label_end }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex border-l border-gray-200 cursor-pointer">
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
import { ExperienceSamplingUseCases } from '@/renderer/core/experience-sampling/ExperienceSamplingUseCases';
import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';
import { getLogger } from '@/shared/logger';
import { ipcRenderer, remote } from 'electron';
import { DateTime } from 'luxon';
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
  private experienceSampling: ExperienceSample | null = null;
  private isLoadingAuth = true;
  private isLoadingExperienceSampling = true;

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
    LOG.info('Created!');

    ipcRenderer.on('experience-sample', (event, experienceSample) => {
      LOG.debug(
        `Received experience-sample event with experienceSample=${JSON.stringify(
          experienceSample
        )}`
      );
      this.experienceSampling = experienceSample;
      this.isLoadingExperienceSampling = false;
    });

    await this.authUseCase.setAuthFromUserAuthDTO(
      await remote.getGlobal('user')
    );
    this.isLoadingAuth = false;
  }

  async onValueClicked(value: number): Promise<void> {
    LOG.debug(`onValueClicked called, value=${value}`);
    this.experienceSamplingUseCase.updateExperienceSamplingValue(
      this.user.id,
      this.experienceSampling!.id,
      value,
      DateTime.now().toString()
    );
    await this.fadeWindowOut();
  }

  async onSkipClicked(): Promise<void> {
    LOG.debug('Skip called, closing window...');
    await this.experienceSamplingUseCase.updateExperienceSamplingSkippedAt(
      this.user.id,
      this.experienceSampling!.id,
      DateTime.now().toString()
    );
    await this.fadeWindowOut();
  }

  private async fadeWindowOut(): Promise<void> {
    const window = await remote.BrowserWindow.getFocusedWindow();
    await window?.setOpacity(0);
    await window?.close();
  }
}
</script>

<style lang="scss" scoped>
.experience-sampling-notification {
  .sample-answer {
    @apply mx-1 flex w-8 h-8 bg-gray-100 text-center items-center text-gray-500 align-middle rounded-md border border-gray-200 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer transition-all;
  }
}
</style>
