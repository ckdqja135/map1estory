"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_module_1 = require("./config/config.module");
const config_1 = require("@nestjs/config");
const auth_routes_1 = require("./routes/auth.routes");
const event_routes_1 = require("./routes/event.routes");
const http_service_1 = require("./services/http.service");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const jwt_strategy_1 = require("./guards/jwt.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_module_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'fallback_secret_key',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') || '1h'
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController, auth_routes_1.AuthRoutes, event_routes_1.EventRoutes],
        providers: [
            app_service_1.AppService,
            http_service_1.HttpService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map