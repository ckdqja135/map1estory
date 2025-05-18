import { Role } from '../../common/enums/role.enum';
export declare class CreateUserDto {
    username: string;
    password: string;
    email: string;
    fullName?: string;
    roles?: Role[];
    isActive?: boolean;
}
