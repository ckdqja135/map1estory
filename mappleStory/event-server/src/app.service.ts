import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Event Service API';
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'event',
      timestamp: new Date().toISOString(),
    };
  }
} 