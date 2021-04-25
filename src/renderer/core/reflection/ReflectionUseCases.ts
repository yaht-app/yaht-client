import { Reflection } from '@/renderer/core/reflection/models/Reflection';
import { ReflectionService } from '@/renderer/core/reflection/ReflectionService';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';

@injectable()
export class ReflectionUseCases {
  constructor(
    @inject(SERVICE.REFLECTION)
    private readonly reflectionService: ReflectionService
  ) {}

  async getReflectionDataForUser(userId: number): Promise<Reflection> {
    return await this.reflectionService.getReflectionDataByUserId(userId);
  }

  async getMockReflectionData(): Promise<void> {
    // todo
  }
}
