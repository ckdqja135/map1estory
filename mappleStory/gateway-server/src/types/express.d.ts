import { UserPayload } from '../interfaces/user.interface';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserPayload {}
  }
} 