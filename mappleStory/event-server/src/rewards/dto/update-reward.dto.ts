import { IsEnum, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { RewardType } from '../../common/enums/reward-type.enum';

export class UpdateRewardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RewardType)
  @IsOptional()
  type?: RewardType;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  updatedBy?: string;
} 