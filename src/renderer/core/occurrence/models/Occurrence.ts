export interface Habit {
  id: number;
  title: string;
  duration: number;
  is_skippable: boolean;
}

export interface Occurrence {
  id: number;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  skipped_at: string | null;
  habit: Habit;
}
