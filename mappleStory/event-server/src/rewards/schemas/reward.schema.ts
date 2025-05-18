import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RewardType } from '../../common/enums/reward-type.enum';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: String, enum: RewardType })
  type: RewardType;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward); 