import { Document } from 'mongoose';
import { Role as RoleEnum } from '../../common/enums/role.enum';
export type RoleDocument = RoleDefinition & Document;
export declare class RoleDefinition {
    name: RoleEnum;
    description: string;
    permissions: string[];
}
export declare const RoleSchema: import("mongoose").Schema<RoleDefinition, import("mongoose").Model<RoleDefinition, any, any, any, Document<unknown, any, RoleDefinition, any> & RoleDefinition & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RoleDefinition, Document<unknown, {}, import("mongoose").FlatRecord<RoleDefinition>, {}> & import("mongoose").FlatRecord<RoleDefinition> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
