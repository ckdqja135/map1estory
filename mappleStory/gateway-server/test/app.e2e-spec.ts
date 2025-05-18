import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Gateway Server (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');
    
    // 포트 4000으로 설정
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 기본 경로 테스트
  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200);
  });
  
  // 헬스체크 테스트 추가
  it('/api/health (GET) - 서버 상태 확인', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200);
  });
  
  // 프록시 테스트 (Auth 서비스) - 인증 필요에 대한 확인
  describe('Auth Proxy', () => {
    it('/api/auth/health (GET) - Auth 서비스 인증 필요 확인', () => {
      return request(app.getHttpServer())
        .get('/api/auth/health')
        .expect(401); // 인증이 필요하므로 401 Unauthorized 반환
    });
  });
  
  // 프록시 테스트 (Event 서비스) - 인증 필요에 대한 확인
  describe('Event Proxy', () => {
    it('/api/events/health (GET) - Event 서비스 인증 필요 확인', () => {
      return request(app.getHttpServer())
        .get('/api/events/health')
        .expect(401); // 인증이 필요하므로 401 Unauthorized 반환
    });
  });
});
