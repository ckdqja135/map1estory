import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RequestStatus } from '../../common/enums/request-status.enum';

export type RequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Reward' }] })
  rewardIds: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String, enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Prop()
  processedBy: string;

  @Prop()
  processingDate: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const RequestSchema = SchemaFactory.createForClass(RewardRequest);