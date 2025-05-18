/**
 * 이벤트 서버의 메인 모듈
 * 
 * Event 서버는 이벤트 관리, 보상 처리, 이벤트 참여 요청 등을 담당하는 마이크로서비스.
 * 이 모듈은 필요한 모든 컴포넌트들을 등록하고 의존성을 설정.
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { RewardsModule } from './rewards/rewards.module';
import { RequestsModule } from './requests/requests.module';
import { AuthModule } from './common/modules/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 환경 설정 모듈 - 전역으로 설정하여 모든 모듈에서 접근 가능
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongoDB 연결 설정 - 이벤트, 보상, 요청 데이터 저장에 사용
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/event-service',
      }),
    }),
    // 인증 모듈 - Gateway 서버와 Auth 서버에서 발급한 JWT 검증을 위한 모듈
    AuthModule,
    // 이벤트 관리 모듈 - 이벤트 생성, 조회, 수정, 삭제 기능
    EventsModule,
    // 보상 관리 모듈 - 이벤트 참여 보상 생성 및 관리
    RewardsModule,
    // 요청 관리 모듈 - 사용자의 이벤트 참여 요청 처리
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
