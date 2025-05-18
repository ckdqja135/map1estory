import { Role } from '../../common/enums/role.enum';
export declare class CreateRoleDto {
    name: Role;
    description?: string;
    permissions?: string[];
}
