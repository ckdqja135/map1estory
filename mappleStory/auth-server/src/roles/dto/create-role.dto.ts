import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  name: Role;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
} 