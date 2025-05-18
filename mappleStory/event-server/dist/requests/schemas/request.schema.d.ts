import { Document, Schema as MongooseSchema } from 'mongoose';
import { RequestStatus } from '../../common/enums/request-status.enum';
export type RequestDocument = RewardRequest & Document;
export declare class RewardRequest {
    userId: string;
    eventId: MongooseSchema.Types.ObjectId;
    rewardIds: MongooseSchema.Types.ObjectId[];
    status: RequestStatus;
    processedBy: string;
    processingDate: Date;
    metadata: Record<string, any>;
}
export declare const RequestSchema: MongooseSchema<RewardRequest, import("mongoose").Model<RewardRequest, any, any, any, Document<unknown, any, RewardRequest, any> & RewardRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RewardRequest, Document<unknown, {}, import("mongoose").FlatRecord<RewardRequest>, {}> & import("mongoose").FlatRecord<RewardRequest> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
