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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_schema_1 = require("./schemas/role.schema");
const role_enum_1 = require("../common/enums/role.enum");
let RolesService = class RolesService {
    roleModel;
    constructor(roleModel) {
        this.roleModel = roleModel;
    }
    async create(createRoleDto) {
        const existingRole = await this.roleModel.findOne({ name: createRoleDto.name }).exec();
        if (existingRole) {
            throw new common_1.ConflictException(`역할 '${createRoleDto.name}'이(가) 이미 존재합니다.`);
        }
        const createdRole = new this.roleModel(createRoleDto);
        return createdRole.save();
    }
    async findAll() {
        return this.roleModel.find().exec();
    }
    async findOne(name) {
        const role = await this.roleModel.findOne({ name }).exec();
        if (!role) {
            throw new common_1.NotFoundException(`역할 '${name}'을(를) 찾을 수 없습니다.`);
        }
        return role;
    }
    async update(name, permissions) {
        const updatedRole = await this.roleModel
            .findOneAndUpdate({ name }, { permissions }, { new: true })
            .exec();
        if (!updatedRole) {
            throw new common_1.NotFoundException(`역할 '${name}'을(를) 찾을 수 없습니다.`);
        }
        return updatedRole;
    }
    async remove(name) {
        if (name === role_enum_1.Role.ADMIN) {
            throw new common_1.ConflictException('관리자 역할은 삭제할 수 없습니다.');
        }
        const deletedRole = await this.roleModel.findOneAndDelete({ name }).exec();
        if (!deletedRole) {
            throw new common_1.NotFoundException(`역할 '${name}'을(를) 찾을 수 없습니다.`);
        }
        return deletedRole;
    }
    async initializeDefaultRoles() {
        const defaultRoles = [
            {
                name: role_enum_1.Role.USER,
                description: '일반 사용자 역할',
                permissions: ['request:create', 'request:read-own'],
            },
            {
                name: role_enum_1.Role.OPERATOR,
                description: '운영자 역할',
                permissions: ['event:create', 'event:update', 'event:read', 'reward:create', 'reward:update', 'reward:read'],
            },
            {
                name: role_enum_1.Role.AUDITOR,
                description: '감사자 역할',
                permissions: ['event:read', 'reward:read', 'request:read'],
            },
            {
                name: role_enum_1.Role.ADMIN,
                description: '관리자 역할',
                permissions: ['*'],
            },
        ];
        for (const role of defaultRoles) {
            const existingRole = await this.roleModel.findOne({ name: role.name }).exec();
            if (!existingRole) {
                await this.roleModel.create(role);
            }
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.RoleDefinition.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RolesService);
//# sourceMappingURL=roles.service.js.map