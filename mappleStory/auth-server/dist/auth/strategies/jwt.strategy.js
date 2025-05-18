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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    constructor(configService) {
        let secretKey = 'your_secure_jwt_secret_key_here';
        try {
            const envPath = path.resolve(process.cwd(), '.env');
            if (fs.existsSync(envPath)) {
                const buffer = fs.readFileSync(envPath);
                let content = buffer.toString();
                if (content.charCodeAt(0) === 0xFEFF || content.startsWith('\uFEFF')) {
                    content = content.replace(/^\uFEFF/, '');
                    console.log('BOM 문자가 제거되었습니다.');
                }
                const lines = content.split('\n');
                for (const line of lines) {
                    if (line.trim() && !line.startsWith('#')) {
                        const parts = line.split('=');
                        if (parts.length >= 2) {
                            const key = parts[0].trim();
                            const value = parts.slice(1).join('=').trim();
                            if (key === 'JWT_SECRET') {
                                secretKey = value;
                                console.log(`JWT_SECRET 값을 성공적으로 로드했습니다.`);
                                break;
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('환경 변수 파일 읽기 오류:', error);
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secretKey,
        });
        this.configService = configService;
    }
    async validate(payload) {
        return {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map