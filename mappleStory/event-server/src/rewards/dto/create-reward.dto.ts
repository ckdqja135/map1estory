import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { RewardType } from '../../common/enums/reward-type.enum';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RewardType)
  @IsNotEmpty()
  type: RewardType;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsMongoId()
  @IsNotEmpty()
  eventId: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 