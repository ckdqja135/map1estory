import { IsArray, IsMongoId, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  eventId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  rewardIds?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 