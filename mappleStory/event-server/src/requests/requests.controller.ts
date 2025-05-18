import { Body, Controller, Get, Param, Post, Query, UseGuards, Request, ForbiddenException, Logger } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RewardRequest } from './schemas/request.schema';
import { RequestFilterDto } from './dto/request-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('requests')
export class RequestsController {
  private readonly logger = new Logger(RequestsController.name);
  
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createRequestDto: CreateRequestDto, @Request() req): Promise<RewardRequest> {
    this.logger.log(`보상 요청 생성: ${JSON.stringify(createRequestDto)}`);
    this.logger.debug(`요청 사용자: ${req.user.sub}, 역할: ${JSON.stringify(req.user.roles)}`);
    
    const userId = req.user.sub;
    return this.requestsService.create(createRequestDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  findAll(@Query() filters: RequestFilterDto, @Request() req): Promise<RewardRequest[]> {
    this.logger.log(`모든 보상 요청 조회, 사용자: ${req.user.sub}, 역할: ${JSON.stringify(req.user.roles)}`);
    this.logger.debug(`필터: ${JSON.stringify(filters)}`);
    
    // 추가 검사 - 일반 사용자는 모든 요청을 조회할 수 없음
    if (!req.user.roles.some(role => [Role.OPERATOR, Role.AUDITOR, Role.ADMIN].includes(role))) {
      this.logger.warn(`사용자 ${req.user.sub}가 권한 없이 모든 보상 요청 조회 시도`);
      throw new ForbiddenException('모든 보상 요청을 조회할 권한이 없습니다');
    }
    
    return this.requestsService.findAll(filters);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(
    @Param('userId') userId: string, 
    @Query() filters: RequestFilterDto, 
    @Request() req
  ): Promise<RewardRequest[]> {
    // 사용자는 자신의 요청만 조회 가능 (ADMIN, AUDITOR, OPERATOR는 모든 사용자 요청 조회 가능)
    const currentUserId = req.user.sub;
    const userRoles = req.user.roles || [];
    
    this.logger.log(`사용자별 보상 요청 조회: ${userId}, 요청자: ${currentUserId}`);
    this.logger.debug(`필터: ${JSON.stringify(filters)}, 사용자 역할: ${JSON.stringify(userRoles)}`);
    
    if (userId !== currentUserId && 
        !userRoles.some(role => [Role.ADMIN, Role.AUDITOR, Role.OPERATOR].includes(role as Role))) {
      this.logger.warn(`사용자 ${currentUserId}가 다른 사용자 ${userId}의 보상 요청 조회 시도`);
      throw new ForbiddenException('다른 사용자의 보상 요청을 조회할 권한이 없습니다');
    }
    
    // 필터에 사용자 ID 설정 (다른 필터는 그대로 유지)
    const userFilters: RequestFilterDto = {
      ...filters,
      userId: userId
    };
    
    return this.requestsService.findAll(userFilters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req): Promise<RewardRequest> {
    // 요청 조회 후 권한 확인 (자신의 요청이거나 관리 권한 있는 사용자)
    this.logger.log(`특정 보상 요청 조회: ${id}, 사용자: ${req.user.sub}`);
    return this.requestsService.findOneWithAuth(id, req.user.sub, req.user.roles);
  }
} 