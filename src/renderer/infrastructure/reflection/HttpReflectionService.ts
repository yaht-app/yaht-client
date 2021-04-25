import SERVICE from '@/constants/ServiceIdentifiers';
import { Reflection } from '@/renderer/core/reflection/models/Reflection';
import { ReflectionService } from '@/renderer/core/reflection/ReflectionService';
import { GenericResponse } from '@/renderer/infrastructure/GenericResponse';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { getLogger } from '@/shared/logger';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

const LOG = getLogger('HttpReflectionService');

@injectable()
export class HttpReflectionService implements ReflectionService {
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  async getReflectionDataByUserId(userId: number): Promise<Reflection> {
    const response: AxiosResponse<
      GenericResponse<Reflection>
    > = await this.httpService.get(`/users/${userId}/reflections`);

    LOG.debug(`Got reflectionDataByUserId(${userId})`);
    return response.data.data;
  }
}
