import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO';

declare global {
  namespace NodeJS {
    interface Global {
      user: UserAuthDTO;
    }
  }
}
