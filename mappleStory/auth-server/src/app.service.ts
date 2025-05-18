import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Auth Service API';
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'auth',
      timestamp: new Date().toISOString(),
    };
  }
}
