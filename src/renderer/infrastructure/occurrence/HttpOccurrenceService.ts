import SERVICE from '@/constants/ServiceIdentifiers';
import { Occurrence } from '@/renderer/core/occurrence/models/Occurrence';
import { OccurrenceService } from '@/renderer/core/occurrence/OccurrenceService';
import { GenericResponse } from '@/renderer/infrastructure/GenericResponse';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { getLogger } from '@/shared/logger';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

const LOG = getLogger('HttpOccurrenceService');

@injectable()
export class HttpOccurrenceService implements OccurrenceService {
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  async getOccurrencesByUserId(userId: number): Promise<Occurrence[]> {
    const response: AxiosResponse<
      GenericResponse<Occurrence[]>
    > = await this.httpService.get(`/users/${userId}/occurrences`);

    LOG.debug(
      `Got occurrencesByUserId(${userId}), length=${response.data.data.length}`
    );
    return response.data.data;
  }

  async updateOccurrenceEndedAt(
    userId: number,
    occurrenceId: number,
    endedAt: string
  ): Promise<Occurrence> {
    const response: AxiosResponse<
      GenericResponse<Occurrence>
    > = await this.httpService.put(
      `/users/${userId}/occurrences/${occurrenceId}`,
      { ended_at: endedAt }
    );
    LOG.debug(`Updated occurrence (id=${occurrenceId}, endedAt=${endedAt})`);
    return response.data.data;
  }

  async updateOccurrenceSkippedAt(
    userId: number,
    occurrenceId: number,
    skippedAt: string
  ): Promise<Occurrence> {
    const response: AxiosResponse<
      GenericResponse<Occurrence>
    > = await this.httpService.put(
      `/users/${userId}/occurrences/${occurrenceId}`,
      { skipped_at: skippedAt }
    );
    LOG.debug(
      `Updated occurrence (id=${occurrenceId}, skippedAt=${skippedAt})`
    );
    return response.data.data;
  }

  async updateOccurrenceStartedAt(
    userId: number,
    occurrenceId: number,
    startedAt: string
  ): Promise<Occurrence> {
    const response: AxiosResponse<
      GenericResponse<Occurrence>
    > = await this.httpService.put(
      `/users/${userId}/occurrences/${occurrenceId}`,
      { started_at: startedAt }
    );
    LOG.debug(
      `Updated occurrence (id=${occurrenceId}, startedAt=${startedAt})`
    );
    return response.data.data;
  }
}
