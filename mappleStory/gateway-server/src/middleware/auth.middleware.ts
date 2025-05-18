import { Injectable, NestMiddleware, UnauthorizedException, Logger, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

interface PublicEndpoint {
  path: string;
  method?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);
  
  // 인증이 필요없는 공개 엔드포인트 목록
  private readonly publicEndpoints: PublicEndpoint[] = [
    { path: '/api/auth/login', method: 'POST' },
    { path: '/api/auth/register', method: 'POST' },
    { path: '/api/health', method: 'GET' },
    { path: '/api/docs', method: 'GET' },
  ];

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const originalUrl = req.originalUrl;
    const method = req.method;
    
    this.logger.debug(`요청 처리: ${method} ${originalUrl}`);
    
    // 공개 경로는 인증 검사 없이 통과
    if (this.isPublicEndpoint(originalUrl, method)) {
      this.logger.debug(`공개 엔드포인트 허용: ${method} ${originalUrl}`);
      return next();
    }

    this.logger.debug(`인증 필요 엔드포인트: ${method} ${originalUrl}`);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn(`인증 토큰 없음: ${method} ${originalUrl}`);
      throw new UnauthorizedException('유효한 인증 토큰이 필요합니다');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      // 요청 객체에 사용자 정보 추가
      req['user'] = payload;
      
      // 권한 검사 (특정 경로에 대한 역할 기반 접근 제어)
      if (this.requiresAdminRole(originalUrl) && !this.hasAdminRole(payload.roles)) {
        this.logger.warn(`권한 부족: ${originalUrl}, 사용자: ${payload.id}`);
        throw new ForbiddenException('이 작업을 수행할 권한이 없습니다');
      }
      
      this.logger.log(`인증 성공: ${originalUrl}, 사용자: ${payload.id}`);
      next();
    } catch (error) {
      this.logger.error(`인증 실패: ${originalUrl}, 오류: ${error.message}`);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('인증 토큰이 만료되었거나 유효하지 않습니다');
    }
  }
  
  private isPublicEndpoint(url: string, method: string): boolean {
    return this.publicEndpoints.some(endpoint => {
      // 경로가 일치하고, 메소드가 지정되지 않았거나 일치하는 경우
      return url.startsWith(endpoint.path) && 
             (!endpoint.method || endpoint.method === method);
    });
  }
  
  private requiresAdminRole(url: string): boolean {
    // Admin 역할이 필요한 경로 패턴 정의
    const adminPaths = [
      '/api/auth/users',     // 사용자 관리
      '/api/events/admin',   // 이벤트 관리
      '/api/roles',          // 역할 관리
    ];
    
    return adminPaths.some(adminPath => url.startsWith(adminPath));
  }
  
  private hasAdminRole(roles: string[]): boolean {
    if (!roles || !Array.isArray(roles)) {
      return false;
    }
    return roles.includes('ADMIN') || roles.includes('OPERATOR');
  }
} 