"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RolesGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let RolesGuard = RolesGuard_1 = class RolesGuard {
    reflector;
    logger = new common_1.Logger(RolesGuard_1.name);
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        this.logger.debug(`필요한 역할: ${JSON.stringify(requiredRoles)}`);
        if (!requiredRoles || requiredRoles.length === 0) {
            this.logger.debug('역할 요구사항이 없습니다. 접근 허용.');
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            this.logger.error('사용자 정보가 없습니다.');
            throw new common_1.UnauthorizedException('권한이 없습니다');
        }
        if (!user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
            this.logger.error(`사용자 ID ${user.sub}의 역할이 없습니다.`);
            throw new common_1.UnauthorizedException('권한이 없습니다');
        }
        this.logger.debug(`사용자 ${user.sub}의 역할: ${JSON.stringify(user.roles)}`);
        const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
        if (!hasRequiredRole) {
            this.logger.warn(`사용자 ${user.sub}는 필요한 역할(${JSON.stringify(requiredRoles)})을 가지고 있지 않습니다.`);
            throw new common_1.UnauthorizedException('해당 작업을 수행할 권한이 없습니다');
        }
        this.logger.debug(`사용자 ${user.sub}는 필요한 역할을 가지고 있습니다. 접근 허용.`);
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = RolesGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map