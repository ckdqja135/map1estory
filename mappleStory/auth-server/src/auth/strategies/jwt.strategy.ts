/**
 * JWT 인증 전략 구현
 * 
 * NestJS Passport 모듈을 사용한 JWT 인증 전략.
 * JWT 토큰을 검증하고 사용자 정보를 추출하는 로직 구현.
 * Windows 환경에서 발생할 수 있는 BOM 문자 처리 로직 포함.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // BOM 문자를 처리하면서 .env 파일에서 JWT_SECRET 값 읽기
    let secretKey = 'your_secure_jwt_secret_key_here'; // 기본값
    
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        // 파일을 바이너리로 읽어서 BOM 문자(EF BB BF) 확인 및 제거
        const buffer = fs.readFileSync(envPath);
        let content = buffer.toString();
        
        // BOM 문자가 있으면 제거 (UTF-8 BOM: EF BB BF)
        if (content.charCodeAt(0) === 0xFEFF || content.startsWith('\uFEFF')) {
          content = content.replace(/^\uFEFF/, '');
          console.log('BOM 문자가 제거되었습니다.');
        }
        
        // 환경 변수 파싱
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.trim() && !line.startsWith('#')) {
            const parts = line.split('=');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              // 첫 번째 등호 이후의 모든 내용을 값으로 취급 (값에 = 기호가 있을 수 있음)
              const value = parts.slice(1).join('=').trim();
              
              if (key === 'JWT_SECRET') {
                secretKey = value;
                console.log(`JWT_SECRET 값을 성공적으로 로드했습니다.`);
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('환경 변수 파일 읽기 오류:', error);
    }
    
    /**
     * Passport JWT 전략 설정
     * - jwtFromRequest: Authorization 헤더에서 Bearer 토큰 추출
     * - ignoreExpiration: 만료된 토큰 거부
     * - secretOrKey: 토큰 검증에 사용할 비밀키
     */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  /**
   * JWT 토큰 페이로드 검증 및 사용자 정보 추출
   * 
   * 검증된 토큰에서 사용자 정보를 추출하여 요청 객체에 추가.
   * 이 정보는 이후 가드나 컨트롤러에서 req.user로 접근 가능.
   * 
   * @param payload JWT 토큰 페이로드
   * @returns 추출된 사용자 정보
   */
  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
} 