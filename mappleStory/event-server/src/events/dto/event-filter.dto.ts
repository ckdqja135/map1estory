import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '../../common/enums/event-status.enum';

export class EventFilterDto {
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
} 