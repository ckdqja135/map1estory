import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { LoginDto } from '../src/auth/dto/login.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('Auth Server (e2e)', () => {
  let app: INestApplication;
  let mongoMemoryServer: MongoMemoryServer;
  let authToken: string;
  
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
    
    // 포트 4001로 설정
    await app.init();
    
    // 기본 역할 초기화
    await request(app.getHttpServer())
      .post('/api/roles/initialize')
      .expect(401); // 인증 필요
      
    // 테스트 사용자 생성
    const createUserDto: CreateUserDto = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
    };
    
    await request(app.getHttpServer())
      .post('/api/users')
      .send(createUserDto)
      .expect(201);
      
    // 테스트 사용자 로그인
    const loginDto: LoginDto = {
      username: 'admin',
      password: 'admin123',
    };
    
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginDto)
      .expect(201);
      
    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
    await mongoMemoryServer.stop();
    await mongoose.disconnect();
  });

  describe('Auth', () => {
    it('/api/auth/login (POST) - 로그인 성공', () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'admin123',
      };
      
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(201)
        .expect(res => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.username).toEqual('admin');
        });
    });
    
    it('/api/auth/login (POST) - 로그인 실패', () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'wrongpassword',
      };
      
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(401);
    });
    
    it('/api/auth/profile (GET) - 프로필 조회', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.username).toEqual('admin');
        });
    });
  });

  describe('Users', () => {
    it('/api/users (GET) - 모든 사용자 조회', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
    
    it('/api/users/:id (GET) - 단일 사용자 조회', async () => {
      const users = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);
        
      const userId = users.body[0]._id;
      
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toEqual(userId);
        });
    });
  });

  describe('Roles', () => {
    it('/api/roles (GET) - 모든 역할 조회', () => {
      return request(app.getHttpServer())
        .get('/api/roles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });
  
  // 헬스체크 테스트 추가
  describe('Health', () => {
    it('/api/health (GET) - 서버 상태 확인', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200);
    });
  });
});
