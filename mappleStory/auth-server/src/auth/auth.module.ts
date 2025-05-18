/**
 * 인증 모듈
 * 
 * Auth 서버의 핵심 모듈로, 사용자 인증, 토큰 관리, 인증 전략 등을 담당.
 * JWT 기반 인증 시스템을 구현하며, 다양한 인증 전략(로컬, JWT)을 제공.
 */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import * as fs from 'fs';
import * as path from 'path';

/**
 * BOM 문자를 처리하여 환경 변수를 로드하는 유틸리티 함수
 * 
 * Windows 환경에서 생성된 .env 파일에서 BOM 문자로 인해 발생하는 문제를 해결.
 * 
 * @param key 로드할 환경 변수 키
 * @param defaultValue 환경 변수가 없을 경우 사용할 기본값
 * @returns 환경 변수 값 또는 기본값
 */
function loadEnvVariable(key: string, defaultValue: string): string {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      // 파일을 바이너리로 읽어서 BOM 문자 제거
      const buffer = fs.readFileSync(envPath);
      let content = buffer.toString();
      
      // BOM 문자가 있으면 제거
      if (content.charCodeAt(0) === 0xFEFF || content.startsWith('\uFEFF')) {
        content = content.replace(/^\uFEFF/, '');
      }
      
      // 환경 변수 파싱
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.trim() && !line.startsWith('#')) {
          const parts = line.split('=');
          if (parts.length >= 2) {
            const envKey = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            
            if (envKey === key) {
              return value;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`환경 변수 ${key} 로드 중 오류:`, error);
  }
  return defaultValue;
}

@Module({
  imports: [
    // 사용자 관리 모듈 - 사용자 정보 조회 및 관리에 사용
    UsersModule,
    // Passport 인증 프레임워크 설정
    PassportModule,
    // JWT 모듈 설정 - 토큰 생성 및 검증에 사용
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 환경 변수 로드 (BOM 문자 처리)
        const secretKey = loadEnvVariable('JWT_SECRET', 'your_secure_jwt_secret_key_here');
        const expiresIn = loadEnvVariable('JWT_EXPIRES_IN', '1d');
        
        console.log(`JWT 모듈에서 사용하는 시크릿 키: ${secretKey}`);
        console.log(`JWT 만료 시간: ${expiresIn}`);
        
        return {
          secret: secretKey, // 게이트웨이 서버와 공유되는 비밀키
          signOptions: { expiresIn }, // 토큰 만료 시간 설정
        };
      },
    }),
  ],
  // 인증 관련 서비스 및 전략 제공자
  providers: [
    AuthService,    // 인증 서비스
    JwtStrategy,    // JWT 토큰 검증 전략
    LocalStrategy,  // 사용자명/비밀번호 인증 전략
  ],
  // API 컨트롤러
  controllers: [AuthController],
  // 다른 모듈에서 사용할 수 있도록 내보내기
  exports: [AuthService],
})
export class AuthModule {} 