/**
 * 인증 관련 비즈니스 로직을 처리하는 서비스
 * 
 * 사용자 인증, 회원가입, 토큰 발급 및 검증 등 인증 관련 핵심 기능을 구현.
 * JWT를 사용한 인증 시스템과 bcrypt를 활용한 비밀번호 검증 로직이 포함되어 있음.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * 사용자 인증 검증
   * 
   * 로컬 전략에서 사용하는 사용자명/비밀번호 기반 인증 방식.
   * 
   * @param username 사용자명
   * @param password 평문 비밀번호
   * @returns 인증 성공 시 사용자 정보(비밀번호 제외), 실패 시 null
   */
  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username) as UserDocument;
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        const { password, ...result } = user.toObject();
        return result;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 회원가입 처리 및 초기 인증 토큰 발급
   * 
   * @param createUserDto 사용자 등록 정보
   * @returns 생성된 사용자 정보 및 JWT 액세스 토큰
   */
  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    
    const payload = { 
      sub: newUser._id, 
      username: newUser.username,
      roles: newUser.roles
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
      },
    };
  }

  /**
   * 사용자 로그인 처리 및 인증 토큰 발급
   * 
   * @param loginDto 로그인 자격 증명
   * @returns 인증 토큰 및 사용자 정보
   * @throws UnauthorizedException 인증 실패 시
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('사용자 이름 또는 비밀번호가 잘못되었습니다.');
    }

    // 사용자 로그인 시간 업데이트
    await this.usersService.updateLastLogin(user._id);

    // JWT 페이로드
    const payload = { 
      sub: user._id, 
      username: user.username,
      roles: user.roles
    };

    // 토큰 발급
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  /**
   * JWT 토큰 유효성 검증
   * 
   * Gateway 서버나 다른 마이크로서비스에서 토큰 검증을 위해 호출할 수 있는 메소드입니다.
   * 
   * @param token 검증할 JWT 토큰
   * @returns 토큰 유효성 및 페이로드
   */
  validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return {
        valid: true,
        payload,
      };
    } catch (error) {
      return { valid: false };
    }
  }
} 