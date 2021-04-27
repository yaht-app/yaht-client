import { Reflection } from '@/renderer/core/reflection/models/Reflection';

export interface ReflectionService {
  getReflectionDataByUserId(userId: number): Promise<Reflection>;
}
