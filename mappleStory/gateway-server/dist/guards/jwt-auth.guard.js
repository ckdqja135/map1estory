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
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    jwtService;
    configService;
    logger = new common_1.Logger(JwtAuthGuard_1.name);
    constructor(jwtService, configService) {
        super();
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const path = request.originalUrl;
        const method = request.method;
        if (this.isPublicPath(path, method)) {
            this.logger.debug(`공개 경로 허용: ${method} ${path}`);
            return true;
        }
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn(`인증 토큰 없음: ${method} ${path}`);
            throw new common_1.UnauthorizedException('유효한 인증 토큰이 필요합니다');
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET') || 'your_secure_jwt_secret_key_here',
            });
            request.user = payload;
            this.logger.debug(`인증 성공: ${method} ${path}, 사용자: ${payload.id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`인증 실패: ${path}, 오류: ${error.message}`);
            throw new common_1.UnauthorizedException('인증 토큰이 만료되었거나 유효하지 않습니다');
        }
    }
    isPublicPath(path, method) {
        const publicPaths = [
            { path: '/api/auth/login', method: 'POST' },
            { path: '/api/auth/register', method: 'POST' },
            { path: '/api/health', method: 'GET' },
            { path: '/api/docs', method: 'GET' },
        ];
        return publicPaths.some(endpoint => path.startsWith(endpoint.path) &&
            (!endpoint.method || endpoint.method === method));
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map