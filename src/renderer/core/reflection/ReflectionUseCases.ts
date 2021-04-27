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

  async getMockReflectionData(): Promise<Reflection> {
    return {
      title: 'It’s time for your weekly reflection.',
      openTextTitle:
        'Reflecting will help you to identify which of your habits are helping you towards achieving your goals.',
      goalQuestion:
        'Do you think that the following habits have worked towards achieving your goal to My awesome goal!?',
      habits: [
        {
          id: '1',
          title: 'awesome habit by sebastian',
        },
        {
          id: '2',
          title: 'focusing',
        },
        {
          id: '3',
          title: 'workday scheduling',
        },
      ],
    };
  }
}
