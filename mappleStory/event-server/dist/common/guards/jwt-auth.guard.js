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
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const dotenv = require("dotenv");
dotenv.config();
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard {
    jwtService;
    configService;
    jwtSecret;
    logger = new common_1.Logger(JwtAuthGuard_1.name);
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.jwtSecret = process.env.JWT_SECRET || 'your_secure_jwt_secret_key_here';
        this.logger.log('JwtAuthGuard 초기화 완료');
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        this.logger.debug(`인증 헤더: ${authHeader ? '존재함' : '존재하지 않음'}`);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.error('인증 헤더가 없거나 Bearer 형식이 아닙니다.');
            throw new common_1.UnauthorizedException('유효한 인증 토큰이 필요합니다');
        }
        const token = authHeader.split(' ')[1];
        try {
            this.logger.debug('토큰 검증 중...');
            const payload = this.jwtService.verify(token, {
                secret: this.jwtSecret,
            });
            this.logger.debug(`토큰 페이로드 사용자: ${payload.sub}, 역할: ${JSON.stringify(payload.roles || [])}`);
            if (!payload.sub) {
                this.logger.error('토큰에 사용자 ID(sub)가 없습니다.');
                throw new common_1.UnauthorizedException('유효하지 않은 토큰 형식');
            }
            if (!payload.roles || !Array.isArray(payload.roles) || payload.roles.length === 0) {
                this.logger.warn(`사용자 ${payload.sub}에 역할이 없습니다. 기본 USER 역할을 할당합니다.`);
                payload.roles = ['USER'];
            }
            request.user = payload;
            return true;
        }
        catch (error) {
            this.logger.error(`토큰 검증 오류: ${error.message}`);
            throw new common_1.UnauthorizedException('인증 토큰이 만료되었거나 유효하지 않습니다');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map