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
var AuthMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthMiddleware = AuthMiddleware_1 = class AuthMiddleware {
    jwtService;
    configService;
    logger = new common_1.Logger(AuthMiddleware_1.name);
    publicEndpoints = [
        { path: '/api/auth/login', method: 'POST' },
        { path: '/api/auth/register', method: 'POST' },
        { path: '/api/health', method: 'GET' },
        { path: '/api/docs', method: 'GET' },
    ];
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async use(req, res, next) {
        const originalUrl = req.originalUrl;
        const method = req.method;
        this.logger.debug(`요청 처리: ${method} ${originalUrl}`);
        if (this.isPublicEndpoint(originalUrl, method)) {
            this.logger.debug(`공개 엔드포인트 허용: ${method} ${originalUrl}`);
            return next();
        }
        this.logger.debug(`인증 필요 엔드포인트: ${method} ${originalUrl}`);
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn(`인증 토큰 없음: ${method} ${originalUrl}`);
            throw new common_1.UnauthorizedException('유효한 인증 토큰이 필요합니다');
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            req['user'] = payload;
            if (this.requiresAdminRole(originalUrl) && !this.hasAdminRole(payload.roles)) {
                this.logger.warn(`권한 부족: ${originalUrl}, 사용자: ${payload.id}`);
                throw new common_1.ForbiddenException('이 작업을 수행할 권한이 없습니다');
            }
            this.logger.log(`인증 성공: ${originalUrl}, 사용자: ${payload.id}`);
            next();
        }
        catch (error) {
            this.logger.error(`인증 실패: ${originalUrl}, 오류: ${error.message}`);
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('인증 토큰이 만료되었거나 유효하지 않습니다');
        }
    }
    isPublicEndpoint(url, method) {
        return this.publicEndpoints.some(endpoint => {
            return url.startsWith(endpoint.path) &&
                (!endpoint.method || endpoint.method === method);
        });
    }
    requiresAdminRole(url) {
        const adminPaths = [
            '/api/auth/users',
            '/api/events/admin',
            '/api/roles',
        ];
        return adminPaths.some(adminPath => url.startsWith(adminPath));
    }
    hasAdminRole(roles) {
        if (!roles || !Array.isArray(roles)) {
            return false;
        }
        return roles.includes('ADMIN') || roles.includes('OPERATOR');
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = AuthMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map