import { Occurrence } from '@/renderer/core/occurrence/models/Occurrence';

export interface OccurrenceService {
  getOccurrencesByUserId(userId: number): Promise<Occurrence[]>;
}
