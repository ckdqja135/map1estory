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
var RequestsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const requests_service_1 = require("./requests.service");
const create_request_dto_1 = require("./dto/create-request.dto");
const request_filter_dto_1 = require("./dto/request-filter.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let RequestsController = RequestsController_1 = class RequestsController {
    requestsService;
    logger = new common_1.Logger(RequestsController_1.name);
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    async create(createRequestDto, req) {
        this.logger.log(`보상 요청 생성: ${JSON.stringify(createRequestDto)}`);
        this.logger.debug(`요청 사용자: ${req.user.sub}, 역할: ${JSON.stringify(req.user.roles)}`);
        const userId = req.user.sub;
        return this.requestsService.create(createRequestDto, userId);
    }
    findAll(filters, req) {
        this.logger.log(`모든 보상 요청 조회, 사용자: ${req.user.sub}, 역할: ${JSON.stringify(req.user.roles)}`);
        this.logger.debug(`필터: ${JSON.stringify(filters)}`);
        if (!req.user.roles.some(role => [role_enum_1.Role.OPERATOR, role_enum_1.Role.AUDITOR, role_enum_1.Role.ADMIN].includes(role))) {
            this.logger.warn(`사용자 ${req.user.sub}가 권한 없이 모든 보상 요청 조회 시도`);
            throw new common_1.ForbiddenException('모든 보상 요청을 조회할 권한이 없습니다');
        }
        return this.requestsService.findAll(filters);
    }
    findByUserId(userId, filters, req) {
        const currentUserId = req.user.sub;
        const userRoles = req.user.roles || [];
        this.logger.log(`사용자별 보상 요청 조회: ${userId}, 요청자: ${currentUserId}`);
        this.logger.debug(`필터: ${JSON.stringify(filters)}, 사용자 역할: ${JSON.stringify(userRoles)}`);
        if (userId !== currentUserId &&
            !userRoles.some(role => [role_enum_1.Role.ADMIN, role_enum_1.Role.AUDITOR, role_enum_1.Role.OPERATOR].includes(role))) {
            this.logger.warn(`사용자 ${currentUserId}가 다른 사용자 ${userId}의 보상 요청 조회 시도`);
            throw new common_1.ForbiddenException('다른 사용자의 보상 요청을 조회할 권한이 없습니다');
        }
        const userFilters = {
            ...filters,
            userId: userId
        };
        return this.requestsService.findAll(userFilters);
    }
    findOne(id, req) {
        this.logger.log(`특정 보상 요청 조회: ${id}, 사용자: ${req.user.sub}`);
        return this.requestsService.findOneWithAuth(id, req.user.sub, req.user.roles);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_request_dto_1.CreateRequestDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.OPERATOR, role_enum_1.Role.AUDITOR, role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_filter_dto_1.RequestFilterDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_filter_dto_1.RequestFilterDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findOne", null);
exports.RequestsController = RequestsController = RequestsController_1 = __decorate([
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map