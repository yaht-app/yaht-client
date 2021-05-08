import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample.ts';

export interface ExperienceSamplingService {
  getExperienceSamplingDataByUserId(userId: number): Promise<ExperienceSample>;
}
