import SERVICE from '@/constants/ServiceIdentifiers';
import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';
import { ExperienceSamplingService } from '@/renderer/core/experience-sampling/ExperienceSamplingService';
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
}
