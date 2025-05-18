/**
 * 인증 관련 요청을 처리하는 라우트 컨트롤러
 * 
 * Auth 마이크로서비스로 인증 및 사용자 관리 요청을 전달.
 * 사용자 로그인, 회원가입, 프로필 조회, 사용자 정보 및 역할 관리 엔드포인트를 포함.
 */
import { Controller, Get, Post, Body, Req, Param, UseGuards, HttpCode, HttpStatus, All } from '@nestjs/common';
import { HttpService } from '../services/http.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { UserPayload } from '../interfaces/user.interface';

@Controller('auth')
export class AuthRoutes {
  constructor(private readonly httpService: HttpService) {}

  /**
   * 사용자 로그인 처리
   * 
   * @param body 로그인 자격 증명 (이메일/아이디, 비밀번호)
   * @returns 인증 토큰 및 사용자 정보
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.httpService.forwardRequest('auth', 'post', '/auth/login', body);
  }

  /**
   * 새 사용자 등록
   * 
   * @param body 사용자 등록 정보
   * @returns 생성된 사용자 정보
   */
  @Post('register')
  async register(@Body() body: any) {
    return this.httpService.forwardRequest('auth', 'post', '/auth/register', body);
  }

  /**
   * 현재 로그인한 사용자의 프로필 정보 조회
   * 
   * @param req 요청 객체 (사용자 정보 포함)
   * @returns 사용자 프로필 정보
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    const user = req.user as UserPayload;
    return this.httpService.forwardRequest('auth', 'get', `/users/${user.id}`, null, headers);
  }
  
  /**
   * 특정 사용자 정보 조회 (관리자 및 운영자 전용)
   * 
   * @param id 조회할 사용자 ID
   * @param req 요청 객체
   * @returns 사용자 정보
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Get('users/:id')
  async getUserInfo(@Param('id') id: string, @Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('auth', 'get', `/users/${id}`, null, headers);
  }
  
  /**
   * 시스템에 등록된 모든 역할 조회 (관리자, 운영자, 감사자 전용)
   * 
   * @param req 요청 객체
   * @returns 역할 목록
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR', 'AUDITOR')
  @Get('roles')
  async getRoles(@Req() req: Request) {
    const headers = { authorization: req.headers.authorization };
    return this.httpService.forwardRequest('auth', 'get', '/roles', null, headers);
  }

  /**
   * 위에 정의되지 않은 모든 인증 관련 요청을 Auth 서비스로 전달
   * 
   * @param req 요청 객체
   * @returns Auth 서비스의 응답
   */
  @UseGuards(JwtAuthGuard)
  @All('*')
  async handleAll(@Req() req: Request) {
    const { method, url, body, headers } = req;
    const endpoint = url.replace('/api/auth', '');
    
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    return this.httpService.forwardRequest(
      'auth',
      method.toLowerCase(),
      path,
      body,
      headers,
    );
  }
} 