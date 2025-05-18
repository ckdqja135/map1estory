import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT 인증 전략 구현
 * 
 * Passport.js의 JWT 전략을 구성하여 토큰 추출 및 검증 방식을 정의한다.
 * 이 전략은 JwtAuthGuard에서 사용되며, 요청 헤더에서 JWT를 추출하고 검증한다.
 * Auth 서버와 동일한 JWT_SECRET을 사용하여 마이크로서비스 간 일관된 인증을 보장한다.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      // Authorization 헤더의 Bearer 토큰에서 JWT 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰은 자동으로 거부
      ignoreExpiration: false,
      // JWT 검증에 사용할 시크릿 키 (Auth 서버와 동일해야 함)
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your_secure_jwt_secret_key_here',
    });
    this.logger.log('JWT 전략 초기화 완료');
  }

  /**
   * 토큰이 검증된 후 호출되는 메서드
   * 
   * @param payload 검증된 JWT 토큰의 내용
   * @returns 요청 객체의 user 속성에 할당될 사용자 정보
   */
  async validate(payload: any) {
    // 검증된 페이로드를 그대로 반환하여 req.user에 할당
    return payload;
  }
} 