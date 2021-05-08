import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';

export interface ExperienceSamplingService {
  getExperienceSamplingDataByUserId(
    userId: number
  ): Promise<ExperienceSample[]>;
}
