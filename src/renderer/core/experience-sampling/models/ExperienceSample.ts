export interface ExperienceSampleScale {
  steps: number;
  label_start: string;
  label_center: string;
  label_end: string;
}
export interface ExperienceSampleConfig {
  id: number;
  title: string;
  prompt: string;
  type: string;
  scale: ExperienceSampleScale;
}
export interface ExperienceSample {
  id: number;
  scheduled_at: string;
  sampled_at: string | null;
  skipped_at: string | null;
  value: string | number | null;
  config: ExperienceSampleConfig;
}
