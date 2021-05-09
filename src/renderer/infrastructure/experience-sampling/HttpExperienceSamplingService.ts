import SERVICE from '@/constants/ServiceIdentifiers';
import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';
import { ExperienceSamplingService } from '@/renderer/core/experience-sampling/ExperienceSamplingService';
import { Occurrence } from '@/renderer/core/occurrence/models/Occurrence';
import { GenericResponse } from '@/renderer/infrastructure/GenericResponse';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { getLogger } from '@/shared/logger';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

const LOG = getLogger('HttpExperienceSamplingService');

@injectable()
export class HttpExperienceSamplingService
  implements ExperienceSamplingService {
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  async getExperienceSamplingDataByUserId(
    userId: number
  ): Promise<ExperienceSample[]> {
    const response: AxiosResponse<
      GenericResponse<ExperienceSample[]>
    > = await this.httpService.get(`/users/${userId}/samplings`);

    LOG.debug(`Got experienceSamplingDataByUserId(${userId})`);
    return response.data.data;
  }

  async updateExperienceSampleValue(
    userId: number,
    experienceSampleId: number,
    value: string | number,
    sampledAt: string
  ): Promise<ExperienceSample> {
    const response: AxiosResponse<
      GenericResponse<ExperienceSample>
    > = await this.httpService.put(
      `/users/${userId}/samplings/${experienceSampleId}`,
      { sampled_at: sampledAt, value: value }
    );
    LOG.debug(
      `Updated experienceSampling (id=${experienceSampleId}, value=${value}, sampledAt=${sampledAt})`
    );
    return response.data.data;
  }

  async updateExperienceSampleSkippedAt(
    userId: number,
    experienceSampleId: number,
    skippedAt: string
  ): Promise<ExperienceSample> {
    const response: AxiosResponse<
      GenericResponse<ExperienceSample>
    > = await this.httpService.put(
      `/users/${userId}/samplings/${experienceSampleId}`,
      { skipped_at: skippedAt }
    );
    LOG.debug(
      `Updated experienceSampling (id=${experienceSampleId}, skippedAt=${skippedAt})`
    );
    return response.data.data;
  }
}
