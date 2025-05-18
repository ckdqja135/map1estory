import { Document, Schema as MongooseSchema } from 'mongoose';
import { RewardType } from '../../common/enums/reward-type.enum';
export type RewardDocument = Reward & Document;
export declare class Reward {
    name: string;
    description: string;
    type: RewardType;
    quantity: number;
    eventId: MongooseSchema.Types.ObjectId;
    metadata: Record<string, any>;
    createdBy: string;
    updatedBy: string;
}
export declare const RewardSchema: MongooseSchema<Reward, import("mongoose").Model<Reward, any, any, any, Document<unknown, any, Reward, any> & Reward & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reward, Document<unknown, {}, import("mongoose").FlatRecord<Reward>, {}> & import("mongoose").FlatRecord<Reward> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
