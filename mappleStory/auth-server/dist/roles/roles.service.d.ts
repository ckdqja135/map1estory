import { Model } from 'mongoose';
import { RoleDefinition, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from '../common/enums/role.enum';
export declare class RolesService {
    private roleModel;
    constructor(roleModel: Model<RoleDocument>);
    create(createRoleDto: CreateRoleDto): Promise<RoleDefinition>;
    findAll(): Promise<RoleDefinition[]>;
    findOne(name: Role): Promise<RoleDefinition>;
    update(name: Role, permissions: string[]): Promise<RoleDefinition>;
    remove(name: Role): Promise<RoleDefinition>;
    initializeDefaultRoles(): Promise<void>;
}
