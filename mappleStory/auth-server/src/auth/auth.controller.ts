/**
 * 인증 관련 API 엔드포인트 컨트롤러
 * 
 * 사용자 인증, 회원가입, 토큰 검증 등의 인증 관련 요청을 처리.
 * Auth 서비스의 주요 기능에 대한, 공개 또는 보호된 API 엔드포인트를 정의.
 */
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 새 사용자 회원가입 처리
   * 
   * @param createUserDto 사용자 등록에 필요한 정보 (이름, 이메일, 비밀번호 등)
   * @returns 생성된 사용자 정보 (비밀번호 제외) 및 인증 토큰
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /**
   * 사용자 로그인 처리
   * 
   * @param loginDto 로그인 자격 증명 (이메일/사용자명, 비밀번호)
   * @returns 인증 토큰 및 사용자 정보
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 현재 인증된 사용자의 프로필 정보 조회
   * 
   * @param req 요청 객체 (JWT 인증으로 해석된 사용자 정보 포함)
   * @returns 현재 인증된 사용자의 정보
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  /**
   * JWT 토큰 유효성 검증
   * 
   * @param token 검증할 JWT 토큰
   * @returns 토큰이 유효한 경우 디코딩된 페이로드, 유효하지 않은 경우 오류
   */
  @Post('validate')
  async validateToken(@Body('token') token: string) {
    return this.authService.validateToken(token);
  }
} 