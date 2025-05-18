import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 역할 기반 접근 제어를 구현한 가드
 * 
 * 각 엔드포인트에 필요한 역할을 검사하여 사용자의 권한을 검증한다.
 * @Roles 데코레이터와 함께 사용되어 특정 역할을 가진 사용자만 접근할 수 있도록 제한한다.
 * 사용자는 해당 역할을 하나 이상 가지고 있어야 접근이 허용된다.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  /**
   * 요청에 대한 역할 기반 권한 검사를 수행한다
   * 
   * @param context 실행 컨텍스트(요청 정보 및 메타데이터 포함)
   * @returns 권한이 있으면 true, 없으면 예외 발생
   */
  canActivate(context: ExecutionContext): boolean {
    // 핸들러에 설정된 필수 역할 메타데이터 조회
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // 메타데이터에 역할이 지정되지 않은 경우 모든 사용자 접근 허용
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const path = request.originalUrl;

    // 사용자 정보 또는 역할 정보가 없는 경우
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      this.logger.warn(`역할 정보 없음: ${path}`);
      return false;
    }

    // 사용자가 필요한 역할 중 하나라도 가지고 있는지 확인
    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
    
    if (!hasRequiredRole) {
      this.logger.warn(`권한 부족: ${path}, 사용자: ${user.id}, 필요한 역할: ${requiredRoles}, 보유 역할: ${user.roles}`);
      throw new ForbiddenException('이 작업을 수행할 권한이 없습니다');
    }

    this.logger.debug(`권한 검증 성공: ${path}, 사용자: ${user.id}`);
    return true;
  }
} 