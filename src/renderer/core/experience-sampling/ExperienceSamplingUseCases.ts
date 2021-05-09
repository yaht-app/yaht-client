import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';
import { ExperienceSamplingService } from '@/renderer/core/experience-sampling/ExperienceSamplingService';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';

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
  ): Promise<ExperienceSample> {
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
  ): Promise<ExperienceSample> {
    return await this.experienceSamplingService.updateExperienceSampleSkippedAt(
      userId,
      experienceSampleId,
      skippedAt
    );
  }
}
