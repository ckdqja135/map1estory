import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

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