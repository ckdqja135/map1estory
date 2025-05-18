import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

// Mock 데이터
const mockUser = {
  _id: 'user-id-1',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedPassword',
  roles: [Role.USER],
  toObject: jest.fn().mockReturnThis(),
  save: jest.fn().mockResolvedValue(this),
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUserModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    
    // userModel.create 메소드를 모킹해서 new this.userModel()을 우회.
    jest.spyOn(service, 'create').mockImplementation(async (createUserDto: CreateUserDto) => {
      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      // 기본 역할 설정
      const roles = createUserDto.roles || [Role.USER];
      
      return {
        ...mockUser,
        ...createUserDto,
        password: hashedPassword,
        roles,
      } as any;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await service.create(createUserDto);
      expect(result.username).toEqual(createUserDto.username);
      expect(result.email).toEqual(createUserDto.email);
      expect(result.roles).toEqual([Role.USER]);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUserModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce([mockUser]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      mockUserModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      });

      const result = await service.findOne('user-id-1');
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('user-id-1');
    });
  });
}); 