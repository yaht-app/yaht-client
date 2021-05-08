import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample.ts';
import { ExperienceSamplingService } from '@/renderer/core/experience-sampling/ExperienceSamplingService.ts';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';

@injectable()
export class ExperienceSamplingUseCases {
  constructor(
    @inject(SERVICE.EXPERIENCE_SAMPLING)
    private readonly experienceSamplingService: ExperienceSamplingService
  ) {}

  async getExperienceSamplingDataForUser(
    userId: number
  ): Promise<ExperienceSample> {
    return await this.experienceSamplingService.getExperienceSamplingDataByUserId(
      userId
    );
  }

  async getMockExperienceSamplingData(): Promise<ExperienceSample> {
    return {
      title: 'It’s time for your weekly reflection.',
      openTextTitle:
        'Reflecting will help you to identify which of your habits are helping you towards achieving your goals.',
      goalQuestion:
        'Do you think that the following habits have worked towards achieving your goal to My awesome goal!?',
      habits: [
        {
          id: '1',
          title: 'awesome habit by sebastian',
        },
        {
          id: '2',
          title: 'focusing',
        },
        {
          id: '3',
          title: 'workday scheduling',
        },
      ],
    };
  }
}
