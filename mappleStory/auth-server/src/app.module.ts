/**
 * 인증 서버의 메인 모듈
 * 
 * Auth 서버는 사용자 인증, 사용자 관리, 역할 관리 등 인증 관련 기능을 담당하는 마이크로서비스.
 * 이 모듈은 모든 필요한 컴포넌트들을 등록하고 의존성을 설정.
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import * as path from 'path';

@Module({
  imports: [
    // 전역 환경 설정 모듈 - 모든 마이크로서비스에서 동일한 설정 사용을 위해 글로벌로 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), '.env'),
      cache: true,
      expandVariables: true,
    }),
    // MongoDB 연결 설정 - 사용자 및 역할 데이터 저장에 사용
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/auth-service',
      }),
    }),
    // 사용자 관리 모듈
    UsersModule,
    // 인증 처리 모듈 (로그인, 회원가입, 토큰 발급 등)
    AuthModule,
    // 역할 기반 접근 제어 모듈
    RolesModule,
  ],
})
export class AppModule {}
