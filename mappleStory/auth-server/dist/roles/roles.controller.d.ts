import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDefinition } from './schemas/role.schema';
import { Role } from '../common/enums/role.enum';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<RoleDefinition>;
    findAll(): Promise<RoleDefinition[]>;
    findOne(name: Role): Promise<RoleDefinition>;
    update(name: Role, permissions: string[]): Promise<RoleDefinition>;
    remove(name: Role): Promise<RoleDefinition>;
    initializeDefaultRoles(): Promise<{
        message: string;
    }>;
}
