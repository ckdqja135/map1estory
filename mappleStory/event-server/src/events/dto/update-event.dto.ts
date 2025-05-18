import { IsDateString, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { EventStatus } from '../../common/enums/event-status.enum';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsString()
  @IsOptional()
  updatedBy?: string;
} 