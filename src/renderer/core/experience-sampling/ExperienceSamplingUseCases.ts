import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';
import { ExperienceSamplingService } from '@/renderer/core/experience-sampling/ExperienceSamplingService';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';
import { DateTime } from 'luxon';

@injectable()
export class ExperienceSamplingUseCases {
  constructor(
    @inject(SERVICE.EXPERIENCE_SAMPLING)
    private readonly experienceSamplingService: ExperienceSamplingService
  ) {}

  async getExperienceSamplingsForUser(
    userId: number
  ): Promise<ExperienceSample[]> {
    return await this.experienceSamplingService.getExperienceSamplingDataByUserId(
      userId
    );
  }

  async updateExperienceSamplingValue(
    userId: number,
    experienceSampleId: number,
    value: string | number,
    sampledAt: string
  ): Promise<void> {
    return await this.experienceSamplingService.updateExperienceSampleValue(
      userId,
      experienceSampleId,
      value,
      sampledAt
    );
  }

  async updateExperienceSamplingSkippedAt(
    userId: number,
    experienceSampleId: number,
    skippedAt: string
  ): Promise<void> {
    return await this.experienceSamplingService.updateExperienceSampleSkippedAt(
      userId,
      experienceSampleId,
      skippedAt
    );
  }

  async getMockExperienceSamplings(): Promise<ExperienceSample[]> {
    return [
      {
        id: Math.floor(Math.random() * 99999),
        scheduled_at: DateTime.now().plus({ seconds: 5 }).toString(),
        sampled_at: null,
        skipped_at: null,
        value: null,
        config: {
          id: Math.floor(Math.random() * 99999),
          title: 'How productive did you feel in the last hour?',
          prompt: 'How productive did you feel in the last hour?',
          type: 'scale',
          scale: {
            steps: 4,
            label_start: 'not at all',
            label_center: 'moderately',
            label_end: 'very',
          },
        },
      },
    ];
  }
}
