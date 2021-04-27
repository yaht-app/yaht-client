import { ReflectionHabit } from '@/renderer/core/reflection/models/ReflectionHabit';

export interface Reflection {
  title: string;
  openTextTitle: string;
  goalQuestion: string;
  habits: ReflectionHabit[];
}
