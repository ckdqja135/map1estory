import { IsDateString, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { EventStatus } from '../../common/enums/event-status.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsObject()
  @IsNotEmpty()
  conditions: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: EventStatus;
} 