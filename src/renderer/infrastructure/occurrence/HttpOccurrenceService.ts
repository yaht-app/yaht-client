import SERVICE from '@/constants/ServiceIdentifiers';
import { Occurrence } from '@/renderer/core/occurrence/models/Occurrence';
import { OccurrenceService } from '@/renderer/core/occurrence/OccurrenceService';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { getLogger } from '@/shared/logger';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

@injectable()
export class HttpOccurrenceService implements OccurrenceService {
  private readonly LOG = getLogger('HttpOccurrenceService');
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  async getOccurrencesByUserId(userId: number): Promise<Occurrence[]> {
    const body: AxiosResponse<Occurrence[]> = await this.httpService.get<
      Occurrence[]
    >(`/users/${userId}/occurrences`);

    this.LOG.info(body);
    return body.data;
  }
}