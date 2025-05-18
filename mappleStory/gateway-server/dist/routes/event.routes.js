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
exports.EventRoutes = void 0;
const common_1 = require("@nestjs/common");
const http_service_1 = require("../services/http.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../guards/roles.decorator");
let EventRoutes = class EventRoutes {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getAllEvents(query, req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('event', 'get', '/events', query, headers);
    }
    async getEventById(id, req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('event', 'get', `/events/${id}`, null, headers);
    }
    async createEvent(body, req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('event', 'post', '/events', body, headers);
    }
    async updateEvent(id, body, req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('event', 'put', `/events/${id}`, body, headers);
    }
    async deleteEvent(id, req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('event', 'delete', `/events/${id}`, null, headers);
    }
    async getAllRewards(req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('event', 'get', '/rewards', null, headers);
    }
    async createReward(body, req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('event', 'post', '/rewards', body, headers);
    }
    async createEventRequest(body, req) {
        const headers = { authorization: req.headers.authorization };
        return this.httpService.forwardRequest('event', 'post', '/requests', body, headers);
    }
    async getUserRewards(req) {
        const headers = { authorization: req.headers.authorization };
        const user = req.user;
        return this.httpService.forwardRequest('event', 'get', `/rewards/user/${user.id}`, null, headers);
    }
    async handleAll(req) {
        const { method, url, body, headers } = req;
        const endpoint = url.replace('/api/events', '');
        const finalPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return this.httpService.forwardRequest('event', method.toLowerCase(), finalPath, method.toLowerCase() === 'get' ? req.query : body, headers);
    }
};
exports.EventRoutes = EventRoutes;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "getAllEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "getEventById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "createEvent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "updateEvent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "deleteEvent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rewards'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "getAllRewards", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR'),
    (0, common_1.Post)('rewards'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "createReward", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('requests'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "createEventRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rewards/user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "getUserRewards", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.All)('*'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventRoutes.prototype, "handleAll", null);
exports.EventRoutes = EventRoutes = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], EventRoutes);
//# sourceMappingURL=event.routes.js.map