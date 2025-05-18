import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role as RoleEnum } from '../../common/enums/role.enum';

export type RoleDocument = RoleDefinition & Document;

@Schema({ timestamps: true })
export class RoleDefinition {
  @Prop({ type: String, enum: RoleEnum, required: true, unique: true })
  name: RoleEnum;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleDefinition); 