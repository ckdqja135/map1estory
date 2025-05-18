/**
 * 이벤트 관리 API 엔드포인트 컨트롤러
 * 
 * 이벤트 생성, 조회, 수정, 삭제 등 이벤트 관리 관련 API 요청을 처리.
 * 관리자 및 운영자만 이벤트를 생성하고 수정할 수 있으며, 삭제는 관리자만 가능.
 */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFilterDto } from './dto/event-filter.dto';
import { Event } from './schemas/event.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * 새 이벤트 생성 (관리자, 운영자 전용)
   * 
   * @param createEventDto 이벤트 생성 정보 (제목, 설명, 시작/종료일, 상태 등)
   * @param req 요청 객체 (JWT에서 추출한 사용자 정보 포함)
   * @returns 생성된 이벤트 정보
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  create(@Body() createEventDto: CreateEventDto, @Request() req): Promise<Event> {
    const userId = req.user.sub; // JWT에서 추출한 사용자 ID
    return this.eventsService.create(createEventDto, userId);
  }

  /**
   * 이벤트 목록 조회 (필터링 옵션 지원)
   * 
   * 상태, 날짜 등의 조건으로 이벤트를 필터링하여 조회할 수 있음.
   * 필터가 없으면 모든 이벤트를 반환.
   * 
   * @param filterDto 이벤트 필터링 조건
   * @returns 필터링된 이벤트 목록
   */
  @Get()
  async findAll(@Query() filterDto: EventFilterDto): Promise<Event[]> {
    // 디버깅 로그
    console.log('원본 필터:', filterDto);
    
    // 필터 파라미터가 유효하지 않거나 비어있는지 확인
    const emptyFilter = !filterDto || Object.keys(filterDto).length === 0 || filterDto.status === undefined;
    
    console.log('빈 필터인가?', emptyFilter);
    
    // 빈 필터이면 모든 이벤트를 가져오기
    if (emptyFilter) {
      console.log('필터 없이 모든 이벤트 조회');
      return this.eventsService.findAll({});
    }
    
    // 유효한 필터가 있으면 필터링 적용
    console.log('필터 적용하여 이벤트 조회:', filterDto);
    return this.eventsService.findAll(filterDto);
  }

  /**
   * ID로 특정 이벤트 조회
   * 
   * @param id 조회할 이벤트 ID
   * @returns 이벤트 상세 정보
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  /**
   * 기존 이벤트 정보 수정 (관리자, 운영자 전용)
   * 
   * @param id 수정할 이벤트 ID
   * @param updateEventDto 수정할 이벤트 정보
   * @param req 요청 객체 (사용자 정보 포함)
   * @returns 수정된 이벤트 정보
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ): Promise<Event> {
    const userId = req.user.sub;
    // 수정 시 수정자 정보도 함께 저장하도록 수정
    return this.eventsService.update(id, { ...updateEventDto, updatedBy: userId });
  }

  /**
   * 이벤트 삭제 (관리자 전용)
   * 
   * @param id 삭제할 이벤트 ID
   * @returns 삭제된 이벤트 정보
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<Event> {
    return this.eventsService.remove(id);
  }
} 