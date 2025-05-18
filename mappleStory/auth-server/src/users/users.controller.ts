/**
 * 사용자 관리 API 엔드포인트 컨트롤러
 * 
 * 사용자 생성, 조회, 수정, 삭제 및 역할 관리 등 사용자 관련 API 요청 처리.
 * 대부분의 기능은 인증 및 권한 확인이 필요함.
 */
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 새 사용자 생성
   * 
   * @param createUserDto 사용자 생성 정보 (이름, 이메일, 비밀번호 등)
   * @returns 생성된 사용자 정보
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(createUserDto);
  }

  /**
   * 모든 사용자 목록 조회 (관리자와 감사자만 접근 가능)
   * 
   * @returns 전체 사용자 목록
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AUDITOR)
  findAll(): Promise<UserDocument[]> {
    return this.usersService.findAll();
  }

  /**
   * ID로 특정 사용자 정보 조회
   * 
   * @param id 조회할 사용자 ID
   * @returns 사용자 상세 정보
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<UserDocument> {
    // 사용자는 자신의 정보만 조회 가능 (서비스 로직에서 처리 필요)
    return this.usersService.findOne(id);
  }

  /**
   * 사용자에게 역할 추가 (관리자만 가능)
   * 
   * @param id 대상 사용자 ID
   * @param role 추가할 역할
   * @returns 업데이트된 사용자 정보
   */
  @Patch(':id/roles/add/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  addRole(
    @Param('id') id: string,
    @Param('role') role: Role,
  ): Promise<UserDocument> {
    return this.usersService.addRole(id, role);
  }

  /**
   * 사용자에게서 역할 제거 (관리자만 가능)
   * 
   * @param id 대상 사용자 ID
   * @param role 제거할 역할
   * @returns 업데이트된 사용자 정보
   */
  @Patch(':id/roles/remove/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeRole(
    @Param('id') id: string,
    @Param('role') role: Role,
  ): Promise<UserDocument> {
    return this.usersService.removeRole(id, role);
  }
} 