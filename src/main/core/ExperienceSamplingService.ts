import { ExperienceSamplingWindowService } from '@/main/core/ExperienceSamplingWindowService';
import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';
import { getLogger } from '@/shared/logger';
import { CronJob } from 'cron';
import { LogFunctions } from 'electron-log';
import { DateTime } from 'luxon';

const LOG: LogFunctions = getLogger('ExperienceSamplingService');

export class ExperienceSamplingService {
  private readonly cronJob: CronJob;
  private experienceSamples: ExperienceSample[] = [];
  private shownExperienceSampleIds: number[] = [];
  private experienceSamplingWindowService;

  constructor() {
    this.experienceSamplingWindowService = new ExperienceSamplingWindowService();
    this.cronJob = new CronJob('*/1 * * * * *', async () => {
      try {
        LOG.silly('Running checkAndTriggerExperienceSample');
        this.checkAndTriggerExperienceSample();
      } catch (e) {
        LOG.error(e);
      }
    });
  }

  public setExperienceSamples(experienceSamples: ExperienceSample[]): void {
    LOG.debug(`Setting ExperienceSamples, length=${experienceSamples.length}`);
    this.experienceSamples = experienceSamples;
    if (experienceSamples.length > 0) {
      this.cronJob.start();
    }
  }

  public stopService(): void {
    this.cronJob.stop();
  }

  private checkAndTriggerExperienceSample(): void {
    const nextScheduledExperienceSample = this.getNextScheduledExperienceSample();
    if (nextScheduledExperienceSample) {
      LOG.debug(
        `Next ExperienceSample scheduled at: ${nextScheduledExperienceSample.scheduled_at.toString()}`
      );
    } else {
      LOG.debug('No experience sampling scheduled');
    }

    const dueExperienceSamples = this.getDueExperienceSamples();
    LOG.debug(`Due ExperienceSamples ${dueExperienceSamples}`);
    dueExperienceSamples.forEach(async (dueExperienceSample) => {
      LOG.debug(`${dueExperienceSample}`);
      if (!this.shownExperienceSampleIds.includes(dueExperienceSample.id)) {
        LOG.debug(`${this.shownExperienceSampleIds}`);
        await this.createAndShowExperienceSampleWindow(dueExperienceSample);
        this.shownExperienceSampleIds.push(dueExperienceSample.id);
        LOG.debug(`${this.shownExperienceSampleIds}`);
      }
    });
  }

  private async createAndShowExperienceSampleWindow(
    experienceSample: ExperienceSample
  ): Promise<void> {
    await this.experienceSamplingWindowService.createWindow(experienceSample);
    await this.experienceSamplingWindowService.showWindow();
  }

  private isExperienceSampleWithinTime(dateTime: DateTime): boolean {
    return (
      dateTime.diffNow('seconds').seconds <= 1 &&
      dateTime.diffNow('seconds').seconds >= -1
    );
  }

  private getDueExperienceSamples(): ExperienceSample[] {
    return this.experienceSamples.filter((experienceSample) => {
      return this.isExperienceSampleWithinTime(
        DateTime.fromISO(experienceSample.scheduled_at)
      );
    });
  }

  private getNextScheduledExperienceSample(): ExperienceSample | undefined {
    let nextExperienceSample: ExperienceSample | undefined;
    this.experienceSamples.forEach((n) => {
      const now = DateTime.now();
      if (DateTime.fromISO(n.scheduled_at) >= now) {
        if (!nextExperienceSample) {
          nextExperienceSample = n;
        }
        if (
          DateTime.fromISO(n.scheduled_at) <=
          DateTime.fromISO(nextExperienceSample.scheduled_at)
        ) {
          nextExperienceSample = n;
        }
      }
    });
    return nextExperienceSample;
  }
}
