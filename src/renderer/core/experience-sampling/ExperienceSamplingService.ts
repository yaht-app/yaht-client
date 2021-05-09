import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';

export interface ExperienceSamplingService {
  getExperienceSamplingDataByUserId(
    userId: number
  ): Promise<ExperienceSample[]>;
  updateExperienceSampleValue(
    userId: number,
    experienceSampleId: number,
    value: string | number,
    sampledAt: string
  ): Promise<ExperienceSample>;
  updateExperienceSampleSkippedAt(
    userId: number,
    experienceSampleId: number,
    skippedAt: string
  ): Promise<ExperienceSample>;
}
