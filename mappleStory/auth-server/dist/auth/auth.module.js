"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_module_1 = require("../users/users.module");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const local_strategy_1 = require("./strategies/local.strategy");
const fs = require("fs");
const path = require("path");
function loadEnvVariable(key, defaultValue) {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const buffer = fs.readFileSync(envPath);
            let content = buffer.toString();
            if (content.charCodeAt(0) === 0xFEFF || content.startsWith('\uFEFF')) {
                content = content.replace(/^\uFEFF/, '');
            }
            const lines = content.split('\n');
            for (const line of lines) {
                if (line.trim() && !line.startsWith('#')) {
                    const parts = line.split('=');
                    if (parts.length >= 2) {
                        const envKey = parts[0].trim();
                        const value = parts.slice(1).join('=').trim();
                        if (envKey === key) {
                            return value;
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        console.error(`환경 변수 ${key} 로드 중 오류:`, error);
    }
    return defaultValue;
}
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const secretKey = loadEnvVariable('JWT_SECRET', 'your_secure_jwt_secret_key_here');
                    const expiresIn = loadEnvVariable('JWT_EXPIRES_IN', '1d');
                    console.log(`JWT 모듈에서 사용하는 시크릿 키: ${secretKey}`);
                    console.log(`JWT 만료 시간: ${expiresIn}`);
                    return {
                        secret: secretKey,
                        signOptions: { expiresIn },
                    };
                },
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            local_strategy_1.LocalStrategy,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map