/**
 * 게이트웨이 서버의 진입점
 * 
 * NestJS 애플리케이션을 초기화하고 설정하는 부트스트랩 함수가 포함되어 있음.
 * 서버 설정, 미들웨어, 글로벌 프리픽스 등을 구성함.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as compression from 'compression';

// 환경 변수 로드
dotenv.config();

/**
 * 애플리케이션 부트스트랩 함수
 * 서버를 초기화하고 필요한 설정을 적용한 후 지정된 포트에서 실행함.
 */
async function bootstrap() {
  const logger = new Logger('GatewayServer');
  const app = await NestFactory.create(AppModule);
  
  // 응답 압축 활성화 - 대역폭 사용량 최적화
  app.use(compression());
  
  // CORS 설정 - 프론트엔드 애플리케이션에서의 요청 허용
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
  });
  
  // DTO 유효성 검사 자동화를 위한 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청 데이터를 DTO 클래스 타입으로 자동 변환
      whitelist: true, // DTO에 정의되지 않은 속성은 자동 제거
    }),
  );
  
  // 모든 API 경로에 '/api' 접두사 추가 - 마이크로서비스 라우팅 일관성 유지
  app.setGlobalPrefix('api');
  
  // 들어오는 모든 요청을 로깅하는 미들웨어
  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  // 환경 변수 또는 기본값으로 서버 포트 설정
  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`게이트웨이 서버가 포트 ${port}에서 실행 중입니다`);
}
bootstrap();
