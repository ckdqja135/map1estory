import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('Event Server (e2e)', () => {
  let app: INestApplication;
  let mongoMemoryServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');
    
    // 포트 4003으로 설정
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoMemoryServer.stop();
    await mongoose.disconnect();
  });

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
  
  // 이벤트 관련 API 테스트
  describe('Events', () => {
    it('/api/events (GET) - 이벤트 목록 조회', () => {
      return request(app.getHttpServer())
        .get('/api/events')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });
});
