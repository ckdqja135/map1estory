import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from '../../common/enums/request-status.enum';

export class RequestFilterDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsMongoId()
  @IsOptional()
  eventId?: string;

  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
} 