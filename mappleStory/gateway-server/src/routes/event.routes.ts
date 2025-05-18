/**
 * 이벤트 및 보상 관련 요청을 처리하는 라우트 컨트롤러
 * 
 * Event 마이크로서비스로 이벤트, 보상, 요청 관련 API 요청을 전달.
 * 이벤트 조회/관리, 보상 생성/조회, 이벤트 참여 요청 등의 엔드포인트를 포함.
 * 대부분의 관리 기능은 관리자와 운영자 역할만 접근 가능.
 */
import { Controller, Get, Post, Body, Req, Param, All, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { HttpService } from '../services/http.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { UserPayload } from '../interfaces/user.interface';

@Controller('events')
export class EventRoutes {
  constructor(private readonly httpService: HttpService) {}

  /**
   * 모든 이벤트 목록 조회
   * 
   * @param query 필터링 및 정렬 옵션
   * @param req 요청 객체
   * @returns 이벤트 목록
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllEvents(@Query() query: any, @Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('event', 'get', '/events', query, headers);
  }

  /**
   * ID로 특정 이벤트 조회
   * 
   * @param id 이벤트 ID
   * @param req 요청 객체
   * @returns 이벤트 상세 정보
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getEventById(@Param('id') id: string, @Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('event', 'get', `/events/${id}`, null, headers);
  }
  
  /**
   * 새 이벤트 생성 (관리자 및 운영자 전용)
   * 
   * @param body 이벤트 생성 정보
   * @param req 요청 객체
   * @returns 생성된 이벤트 정보
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post()
  async createEvent(@Body() body: any, @Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('event', 'post', '/events', body, headers);
  }
  
  /**
   * 기존 이벤트 정보 수정 (관리자 및 운영자 전용)
   * 
   * @param id 수정할 이벤트 ID
   * @param body 수정할 이벤트 정보
   * @param req 요청 객체
   * @returns 수정된 이벤트 정보
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('event', 'put', `/events/${id}`, body, headers);
  }
  
  /**
   * 이벤트 삭제 (관리자 전용)
   * 
   * @param id 삭제할 이벤트 ID
   * @param req 요청 객체
   * @returns 삭제 결과
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteEvent(@Param('id') id: string, @Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('event', 'delete', `/events/${id}`, null, headers);
  }

  /**
   * 모든 보상 목록 조회
   * 
   * @param req 요청 객체
   * @returns 보상 목록
   */
  @UseGuards(JwtAuthGuard)
  @Get('rewards')
  async getAllRewards(@Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('event', 'get', '/rewards', null, headers);
  }

  /**
   * 새 보상 생성 (관리자 및 운영자 전용)
   * 
   * @param body 보상 생성 정보
   * @param req 요청 객체
   * @returns 생성된 보상 정보
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post('rewards')
  async createReward(@Body() body: any, @Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('event', 'post', '/rewards', body, headers);
  }

  /**
   * 이벤트 참여 요청 생성
   * 
   * @param body 요청 생성 정보
   * @param req 요청 객체
   * @returns 생성된 요청 정보
   */
  @UseGuards(JwtAuthGuard)
  @Post('requests')
  async createEventRequest(@Body() body: any, @Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('event', 'post', '/requests', body, headers);
  }

  /**
   * 현재 로그인한 사용자의 보상 목록 조회
   * 
   * @param req 요청 객체
   * @returns 사용자 보상 목록
   */
  @UseGuards(JwtAuthGuard)
  @Get('rewards/user')
  async getUserRewards(@Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    const user = req.user as UserPayload;
    return this.httpService.forwardRequest('event', 'get', `/rewards/user/${user.id}`, null, headers);
  }

  /**
   * 위에 정의되지 않은 모든 이벤트 관련 요청을 Event 서비스로 전달
   * 
   * @param req 요청 객체
   * @returns Event 서비스의 응답
   */
  @UseGuards(JwtAuthGuard)
  @All('*')
  async handleAll(@Req() req: Request) {
    const { method, url, body, headers } = req;
    const endpoint = url.replace('/api/events', '');
    
    const finalPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    return this.httpService.forwardRequest(
      'event',
      method.toLowerCase(),
      finalPath,
      method.toLowerCase() === 'get' ? req.query : body,
      headers,
    );
  }
} 