import { IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  @IsOptional()
  roles?: Role[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 