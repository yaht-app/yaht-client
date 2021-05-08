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

  async getMockExperienceSamplings(): Promise<ExperienceSample[]> {
    return [
      {
        id: 1234,
        scheduled_at: DateTime.now().plus({ seconds: 30 }).toString(),
        prompt: 'How productive did you feel in the last hour?',
        scale_start: 1,
        scale_end: 7,
        scale_label_start: 'not at all',
        scale_label_center: 'not at all',
        scale_label_end: 'not at all',
      },
    ];
  }
}
