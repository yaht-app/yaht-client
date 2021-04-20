import { Occurrence } from '@/renderer/core/occurrence/models/Occurrence';

export interface OccurrenceService {
  getOccurrencesByUserId(userId: number): Promise<Occurrence[]>;
  updateOccurrenceEndedAt(
    userId: number,
    occurrenceId: number,
    endedAt: string
  ): Promise<Occurrence>;
  updateOccurrenceSkippedAt(
    userId: number,
    occurrenceId: number,
    skippedAt: string
  ): Promise<Occurrence>;
  updateOccurrenceStartedAt(
    userId: number,
    occurrenceId: number,
    startedAt: string
  ): Promise<Occurrence>;
}
