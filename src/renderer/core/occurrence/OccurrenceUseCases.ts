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
}
