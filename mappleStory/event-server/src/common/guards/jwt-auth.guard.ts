import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret: string;
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // JWT_SECRET 환경변수 또는 기본값 사용
    this.jwtSecret = process.env.JWT_SECRET || 'your_secure_jwt_secret_key_here';
    this.logger.log('JwtAuthGuard 초기화 완료');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.debug(`인증 헤더: ${authHeader ? '존재함' : '존재하지 않음'}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.error('인증 헤더가 없거나 Bearer 형식이 아닙니다.');
      throw new UnauthorizedException('유효한 인증 토큰이 필요합니다');
    }

    const token = authHeader.split(' ')[1];

    try {
      this.logger.debug('토큰 검증 중...');
      const payload = this.jwtService.verify(token, {
        secret: this.jwtSecret,
      });
      
      this.logger.debug(`토큰 페이로드 사용자: ${payload.sub}, 역할: ${JSON.stringify(payload.roles || [])}`);

      // 페이로드에 필수 정보가 있는지 확인
      if (!payload.sub) {
        this.logger.error('토큰에 사용자 ID(sub)가 없습니다.');
        throw new UnauthorizedException('유효하지 않은 토큰 형식');
      }

      // roles가 없는 경우 기본 USER 역할 설정
      if (!payload.roles || !Array.isArray(payload.roles) || payload.roles.length === 0) {
        this.logger.warn(`사용자 ${payload.sub}에 역할이 없습니다. 기본 USER 역할을 할당합니다.`);
        payload.roles = ['USER'];
      }

      // 요청 객체에 사용자 정보 추가
      request.user = payload;
      return true;
    } catch (error) {
      this.logger.error(`토큰 검증 오류: ${error.message}`);
      throw new UnauthorizedException('인증 토큰이 만료되었거나 유효하지 않습니다');
    }
  }
} 