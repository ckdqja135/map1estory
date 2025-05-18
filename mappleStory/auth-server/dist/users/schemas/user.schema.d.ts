import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';
export type UserDocument = User & Document;
export declare class User {
    username: string;
    password: string;
    email: string;
    fullName?: string;
    roles: Role[];
    isActive: boolean;
    lastLogin?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
