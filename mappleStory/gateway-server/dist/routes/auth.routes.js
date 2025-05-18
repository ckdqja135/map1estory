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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const common_1 = require("@nestjs/common");
const http_service_1 = require("../services/http.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../guards/roles.decorator");
let AuthRoutes = class AuthRoutes {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    async login(body) {
        return this.httpService.forwardRequest('auth', 'post', '/auth/login', body);
    }
    async register(body) {
        return this.httpService.forwardRequest('auth', 'post', '/auth/register', body);
    }
    async getProfile(req) {
        const headers = { authorization: req.headers.authorization };
        const user = req.user;
        return this.httpService.forwardRequest('auth', 'get', `/users/${user.id}`, null, headers);
    }
    async getUserInfo(id, req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('auth', 'get', `/users/${id}`, null, headers);
    }
    async getRoles(req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('auth', 'get', '/roles', null, headers);
    }
    async handleAll(req) {
        const { method, url, body, headers } = req;
        const endpoint = url.replace('/api/auth', '');
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return this.httpService.forwardRequest('auth', method.toLowerCase(), path, body, headers);
    }
};
exports.AuthRoutes = AuthRoutes;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRoutes.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRoutes.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRoutes.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthRoutes.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR', 'AUDITOR'),
    (0, common_1.Get)('roles'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRoutes.prototype, "getRoles", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.All)('*'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRoutes.prototype, "handleAll", null);
exports.AuthRoutes = AuthRoutes = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], AuthRoutes);
//# sourceMappingURL=auth.routes.js.map