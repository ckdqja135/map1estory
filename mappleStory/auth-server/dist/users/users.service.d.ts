import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findOne(id: string): Promise<UserDocument>;
    findByUsername(username: string): Promise<UserDocument>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    remove(id: string): Promise<UserDocument>;
    addRole(userId: string, role: Role): Promise<UserDocument>;
    removeRole(userId: string, role: Role): Promise<UserDocument>;
    updateLastLogin(userId: string): Promise<void>;
}
