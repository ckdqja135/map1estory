import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { Role } from '../common/enums/role.enum';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findOne(id: string): Promise<UserDocument>;
    addRole(id: string, role: Role): Promise<UserDocument>;
    removeRole(id: string, role: Role): Promise<UserDocument>;
}
