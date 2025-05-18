import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'MappleStory API Gateway';
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
