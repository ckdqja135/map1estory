/**
 * Event 서버의 진입점
 * 
 * 이벤트 및 보상 관리 마이크로서비스를 초기화하고 실행하기 위한 부트스트랩 함수가 포함되어 있음.
 * 서버 설정, API 접두사 설정, 유효성 검사 등의 초기화 작업을 수행함.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * 애플리케이션 부트스트랩 함수
 * 서버를 초기화하고 필요한 설정을 적용한 후 지정된 포트에서 실행함.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // DTO 유효성 검사 파이프 설정 - 요청 데이터 자동 변환 및 검증
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // 모든 API 경로에 '/api' 접두사 추가 - 게이트웨이 라우팅과의 일관성 유지
  app.setGlobalPrefix('api');
  
  // 이벤트 서버는 3003 포트에서 실행
  await app.listen(3003);
  console.log(`이벤트 서비스가 http://localhost:3003/api 에서 실행 중입니다.`);
}
bootstrap();
