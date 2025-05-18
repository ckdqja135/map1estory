import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventStatus } from '../../common/enums/event-status.enum';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Object, required: true })
  conditions: Record<string, any>;

  @Prop({ type: String, enum: EventStatus, default: EventStatus.INACTIVE })
  status: EventStatus;

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const EventSchema = SchemaFactory.createForClass(Event); 