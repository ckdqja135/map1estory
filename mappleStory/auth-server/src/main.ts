/**
 * Auth 서버의 진입점
 * 
 * 인증 마이크로서비스를 초기화하고 실행하기 위한 부트스트랩 함수가 포함되어 있음.
 * 환경 변수 로드, 서버 설정, API 접두사 설정 등의 초기화 작업을 수행.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 애플리케이션 시작 전에 .env 파일을 명시적으로 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * 애플리케이션 부트스트랩 함수
 * 서버를 초기화하고 필요한 설정을 적용한 후 지정된 포트에서 실행.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // DTO 유효성 검사 파이프 설정 - 요청 데이터 자동 변환 및 검증
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // 모든 API 경로에 '/api' 접두사 추가 - 게이트웨이 라우팅과의 일관성 유지
  app.setGlobalPrefix('api');
  
  // 환경 변수 또는 기본값(3001)으로 서버 포트 설정
  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
  
  console.log(`Auth 서비스가 http://localhost:${port}/api 에서 실행 중입니다`);
}
bootstrap();
