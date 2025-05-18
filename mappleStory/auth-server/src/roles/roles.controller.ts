/**
 * 역할 관리 API 엔드포인트 컨트롤러
 * 
 * 역할 생성, 조회, 수정, 삭제 등 역할 관리 관련 API 요청 처리.
 * 모든 엔드포인트는 관리자만 접근 가능하도록 제한됨.
 */
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDefinition } from './schemas/role.schema';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * 새 역할 정의 생성
   * 
   * @param createRoleDto 역할 생성 정보 (이름, 설명, 권한 목록)
   * @returns 생성된 역할 정의
   */
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDefinition> {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * 모든 역할 정의 목록 조회
   * 
   * @returns 전체 역할 정의 목록
   */
  @Get()
  @Roles(Role.ADMIN)
  findAll(): Promise<RoleDefinition[]> {
    return this.rolesService.findAll();
  }

  /**
   * 특정 역할 정의 조회
   * 
   * @param name 조회할 역할 이름
   * @returns 역할 정의 상세 정보
   */
  @Get(':name')
  @Roles(Role.ADMIN)
  findOne(@Param('name') name: Role): Promise<RoleDefinition> {
    return this.rolesService.findOne(name);
  }

  /**
   * 역할 권한 목록 수정
   * 
   * @param name 수정할 역할 이름
   * @param permissions 새 권한 목록
   * @returns 수정된 역할 정의
   */
  @Patch(':name')
  @Roles(Role.ADMIN)
  update(
    @Param('name') name: Role,
    @Body('permissions') permissions: string[],
  ): Promise<RoleDefinition> {
    return this.rolesService.update(name, permissions);
  }

  /**
   * 역할 정의 삭제
   * 
   * @param name 삭제할 역할 이름
   * @returns 삭제된 역할 정의
   */
  @Delete(':name')
  @Roles(Role.ADMIN)
  remove(@Param('name') name: Role): Promise<RoleDefinition> {
    return this.rolesService.remove(name);
  }

  /**
   * 기본 역할 정의 초기화
   * 
   * 시스템에서 사용하는 기본 역할(ADMIN, USER 등)을 생성하거나 업데이트함.
   * 
   * @returns 초기화 완료 메시지
   */
  @Post('initialize')
  @Roles(Role.ADMIN)
  async initializeDefaultRoles() {
    await this.rolesService.initializeDefaultRoles();
    return { message: '기본 역할이 초기화되었습니다.' };
  }
} 