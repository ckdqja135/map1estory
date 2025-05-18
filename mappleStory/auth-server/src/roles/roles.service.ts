import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleDefinition, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleDefinition.name)
    private roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDefinition> {
    const existingRole = await this.roleModel.findOne({ name: createRoleDto.name }).exec();
    
    if (existingRole) {
      throw new ConflictException(`역할 '${createRoleDto.name}'이(가) 이미 존재합니다.`);
    }
    
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async findAll(): Promise<RoleDefinition[]> {
    return this.roleModel.find().exec();
  }

  async findOne(name: Role): Promise<RoleDefinition> {
    const role = await this.roleModel.findOne({ name }).exec();
    
    if (!role) {
      throw new NotFoundException(`역할 '${name}'을(를) 찾을 수 없습니다.`);
    }
    
    return role;
  }

  async update(name: Role, permissions: string[]): Promise<RoleDefinition> {
    const updatedRole = await this.roleModel
      .findOneAndUpdate(
        { name },
        { permissions },
        { new: true },
      )
      .exec();
    
    if (!updatedRole) {
      throw new NotFoundException(`역할 '${name}'을(를) 찾을 수 없습니다.`);
    }
    
    return updatedRole;
  }

  async remove(name: Role): Promise<RoleDefinition> {
    // ADMIN 역할은 삭제 불가
    if (name === Role.ADMIN) {
      throw new ConflictException('관리자 역할은 삭제할 수 없습니다.');
    }
    
    const deletedRole = await this.roleModel.findOneAndDelete({ name }).exec();
    
    if (!deletedRole) {
      throw new NotFoundException(`역할 '${name}'을(를) 찾을 수 없습니다.`);
    }
    
    return deletedRole;
  }

  async initializeDefaultRoles(): Promise<void> {
    const defaultRoles = [
      {
        name: Role.USER,
        description: '일반 사용자 역할',
        permissions: ['request:create', 'request:read-own'],
      },
      {
        name: Role.OPERATOR,
        description: '운영자 역할',
        permissions: ['event:create', 'event:update', 'event:read', 'reward:create', 'reward:update', 'reward:read'],
      },
      {
        name: Role.AUDITOR,
        description: '감사자 역할',
        permissions: ['event:read', 'reward:read', 'request:read'],
      },
      {
        name: Role.ADMIN,
        description: '관리자 역할',
        permissions: ['*'], // 모든 권한
      },
    ];

    for (const role of defaultRoles) {
      const existingRole = await this.roleModel.findOne({ name: role.name }).exec();
      
      if (!existingRole) {
        await this.roleModel.create(role);
      }
    }
  }
} 