import { Occurrence } from '@/renderer/core/occurrence/models/Occurrence';
import { OccurrenceService } from '@/renderer/core/occurrence/OccurrenceService';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';

@injectable()
export class OccurrenceUseCases {
  constructor(
    @inject(SERVICE.OCCURRENCE)
    private readonly occurrenceService: OccurrenceService
  ) {}

  async getOccurrencesForUser(userId: number): Promise<Occurrence[]> {
    return await this.occurrenceService.getOccurrencesByUserId(userId);
  }

  async updateOccurrenceEndedAt(
    userId: number,
    occurrenceId: number,
    endedAt: string
  ): Promise<Occurrence> {
    return await this.occurrenceService.updateOccurrenceEndedAt(
      userId,
      occurrenceId,
      endedAt
    );
  }

  async updateOccurrenceSkippedAt(
    userId: number,
    occurrenceId: number,
    skippedAt: string
  ): Promise<Occurrence> {
    return await this.occurrenceService.updateOccurrenceSkippedAt(
      userId,
      occurrenceId,
      skippedAt
    );
  }

  async updateOccurrenceStartedAt(
    userId: number,
    occurrenceId: number,
    startedAt: string
  ): Promise<Occurrence> {
    return await this.occurrenceService.updateOccurrenceStartedAt(
      userId,
      occurrenceId,
      startedAt
    );
  }
}
