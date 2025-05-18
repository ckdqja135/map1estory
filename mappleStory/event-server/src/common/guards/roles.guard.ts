import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`필요한 역할: ${JSON.stringify(requiredRoles)}`);

    // 역할 요구사항이 없으면 접근 허용
    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.debug('역할 요구사항이 없습니다. 접근 허용.');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 사용자가 없거나 역할이 없으면 접근 거부
    if (!user) {
      this.logger.error('사용자 정보가 없습니다.');
      throw new UnauthorizedException('권한이 없습니다');
    }
    
    if (!user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
      this.logger.error(`사용자 ID ${user.sub}의 역할이 없습니다.`);
      throw new UnauthorizedException('권한이 없습니다');
    }

    this.logger.debug(`사용자 ${user.sub}의 역할: ${JSON.stringify(user.roles)}`);

    // 사용자 역할이 요구되는 역할 중 하나라도 포함되는지 확인
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles.includes(role)
    );

    if (!hasRequiredRole) {
      this.logger.warn(`사용자 ${user.sub}는 필요한 역할(${JSON.stringify(requiredRoles)})을 가지고 있지 않습니다.`);
      throw new UnauthorizedException('해당 작업을 수행할 권한이 없습니다');
    }

    this.logger.debug(`사용자 ${user.sub}는 필요한 역할을 가지고 있습니다. 접근 허용.`);
    return true;
  }
} 