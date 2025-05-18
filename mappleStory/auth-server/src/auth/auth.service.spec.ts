import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'user-id-1',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$Vr1YEWtw6I3uCJZ5Ke7FneMn4V2iAOB02h5oT9O3bfIcl7H9c1VE2', // 'password123'의 해시
    roles: [Role.USER],
    toObject: jest.fn().mockReturnValue({
      _id: 'user-id-1',
      username: 'testuser',
      email: 'test@example.com',
      roles: [Role.USER],
    }),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
    updateLastLogin: jest.fn().mockResolvedValue(undefined),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      mockUsersService.findByUsername.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const result = await service.validateUser('testuser', 'password123');
      expect(result).toEqual({
        _id: 'user-id-1',
        username: 'testuser',
        email: 'test@example.com',
        roles: [Role.USER],
      });
    });

    it('should return null when user does not exist', async () => {
      mockUsersService.findByUsername.mockRejectedValueOnce(new Error('Not found'));

      const result = await service.validateUser('nonexistent', 'password123');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      mockUsersService.findByUsername.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

      const result = await service.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate a JWT token', async () => {
      const loginDto = { username: 'testuser', password: 'password123' };
      const userObject = {
        _id: 'user-id-1',
        username: 'testuser',
        email: 'test@example.com',
        roles: [Role.USER],
      };

      jest.spyOn(service, 'validateUser').mockResolvedValueOnce(userObject);
      mockJwtService.sign.mockReturnValueOnce('generated-jwt-token');

      const result = await service.login(loginDto);
      expect(result).toEqual({
        access_token: 'generated-jwt-token',
        user: {
          id: 'user-id-1',
          username: 'testuser',
          email: 'test@example.com',
          roles: [Role.USER],
        }
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: userObject.username,
        sub: userObject._id,
        roles: userObject.roles,
      });
      expect(mockUsersService.updateLastLogin).toHaveBeenCalledWith(userObject._id);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto = { username: 'testuser', password: 'wrongpassword' };
      
      jest.spyOn(service, 'validateUser').mockResolvedValueOnce(null);
      
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateToken', () => {
    it('should return token payload when token is valid', () => {
      const payload = {
        username: 'testuser',
        sub: 'user-id-1',
        roles: [Role.USER],
      };
      
      mockJwtService.verify.mockReturnValueOnce(payload);
      
      expect(service.validateToken('valid-token')).toEqual({
        valid: true,
        payload,
      });
    });

    it('should return invalid when token is invalid', () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      expect(service.validateToken('invalid-token')).toEqual({ valid: false });
    });
  });
}); 