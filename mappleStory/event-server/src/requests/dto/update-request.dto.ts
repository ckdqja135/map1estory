import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from '../../common/enums/request-status.enum';

export class UpdateRequestDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @IsString()
  @IsOptional()
  processedBy?: string;
} 