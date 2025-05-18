import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT 기반 인증을 처리하는 가드
 * 
 * 모든 API 요청에 대한 인증을 담당하며 공개 경로는 인증 없이 통과시킨다.
 * Passport.js의 AuthGuard를 확장하여 JWT 검증 기능을 커스터마이징했다.
 * NestJS의 가드 시스템을 활용해 인증 로직을 중앙화하고 라우트에 쉽게 적용할 수 있게 한다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  /**
   * 요청에 대한 인증 검사를 수행한다
   * 
   * @param context 실행 컨텍스트(요청 정보 포함)
   * @returns 인증 성공 시 true, 실패 시 예외 발생
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.originalUrl;
    const method = request.method;

    // 공개 경로는 인증 없이 통과
    if (this.isPublicPath(path, method)) {
      this.logger.debug(`공개 경로 허용: ${method} ${path}`);
      return true;
    }

    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn(`인증 토큰 없음: ${method} ${path}`);
      throw new UnauthorizedException('유효한 인증 토큰이 필요합니다');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // JWT 토큰 검증 - Auth 서버와 동일한 시크릿 키 사용
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'your_secure_jwt_secret_key_here',
      });
      
      // 검증된 사용자 정보를 요청 객체에 추가 (다운스트림 핸들러에서 사용)
      request.user = payload;
      this.logger.debug(`인증 성공: ${method} ${path}, 사용자: ${payload.id}`);
      return true;
    } catch (error) {
      this.logger.error(`인증 실패: ${path}, 오류: ${error.message}`);
      throw new UnauthorizedException('인증 토큰이 만료되었거나 유효하지 않습니다');
    }
  }

  /**
   * 공개 접근이 허용된 경로인지 확인한다
   * 
   * @param path 요청 경로
   * @param method HTTP 메서드
   * @returns 공개 경로이면 true, 아니면 false
   */
  private isPublicPath(path: string, method: string): boolean {
    const publicPaths = [
      { path: '/api/auth/login', method: 'POST' },
      { path: '/api/auth/register', method: 'POST' },
      { path: '/api/health', method: 'GET' },
      { path: '/api/docs', method: 'GET' },
    ];

    return publicPaths.some(endpoint => 
      path.startsWith(endpoint.path) && 
      (!endpoint.method || endpoint.method === method)
    );
  }
} 