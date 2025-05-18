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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        try {
            const user = await this.usersService.findByUsername(username);
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                const { password, ...result } = user.toObject();
                return result;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async register(createUserDto) {
        const newUser = await this.usersService.create(createUserDto);
        const payload = {
            sub: newUser._id,
            username: newUser.username,
            roles: newUser.roles
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                roles: newUser.roles,
            },
        };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자 이름 또는 비밀번호가 잘못되었습니다.');
        }
        await this.usersService.updateLastLogin(user._id);
        const payload = {
            sub: user._id,
            username: user.username,
            roles: user.roles
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles,
            },
        };
    }
    validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            return {
                valid: true,
                payload,
            };
        }
        catch (error) {
            return { valid: false };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map