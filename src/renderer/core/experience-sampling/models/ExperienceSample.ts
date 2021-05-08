import { ReflectionHabit } from '@/renderer/core/experience-sampling/models/ReflectionHabit';

export interface ExperienceSample {
  title: string;
  openTextTitle: string;
  goalQuestion: string;
  habits: ReflectionHabit[];
}
