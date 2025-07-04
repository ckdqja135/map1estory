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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
const role_enum_1 = require("../common/enums/role.enum");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const existingUser = await this.userModel.findOne({
            $or: [
                { username: createUserDto.username },
                { email: createUserDto.email },
            ],
        });
        if (existingUser) {
            throw new common_1.ConflictException('사용자 이름 또는 이메일이 이미 사용 중입니다.');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const roles = createUserDto.roles || [role_enum_1.Role.USER];
        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
            roles,
        });
        return newUser.save();
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다.`);
        }
        return user;
    }
    async findByUsername(username) {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new common_1.NotFoundException(`사용자 이름 ${username}을 찾을 수 없습니다.`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다.`);
        }
        return updatedUser;
    }
    async remove(id) {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new common_1.NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다.`);
        }
        return deletedUser;
    }
    async addRole(userId, role) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
        }
        if (!user.roles.includes(role)) {
            user.roles.push(role);
            return user.save();
        }
        return user;
    }
    async removeRole(userId, role) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
        }
        if (user.roles.includes(role)) {
            user.roles = user.roles.filter(r => r !== role);
            return user.save();
        }
        return user;
    }
    async updateLastLogin(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            lastLogin: new Date()
        }).exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map