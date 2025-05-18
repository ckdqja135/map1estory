/**
 * 사용자 관리 비즈니스 로직을 처리하는 서비스
 * 
 * 사용자 생성, 조회, 수정, 삭제 및 역할 관리 등 사용자 관련 핵심 기능 구현.
 * MongoDB를 사용하여 사용자 데이터 관리 및 bcrypt로 비밀번호 보안 처리.
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * 새 사용자 생성 
   * 
   * 비밀번호 해싱 및 중복 사용자 확인 처리.
   * 
   * @param createUserDto 사용자 생성 정보
   * @returns 생성된 사용자 정보
   * @throws ConflictException 사용자명 또는 이메일이 이미 존재하는 경우
   */
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // 사용자 이름이나 이메일이 이미 존재하는지 확인
    const existingUser = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('사용자 이름 또는 이메일이 이미 사용 중입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 기본 역할 설정 (없을 경우 USER 역할 부여)
    const roles = createUserDto.roles || [Role.USER];

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      roles,
    });

    return newUser.save();
  }

  /**
   * 모든 사용자 목록 조회
   * 
   * @returns 전체 사용자 목록
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  /**
   * ID로 특정 사용자 정보 조회
   * 
   * @param id 조회할 사용자 ID
   * @returns 사용자 상세 정보
   * @throws NotFoundException 해당 ID의 사용자가 없는 경우
   */
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다.`);
    }
    return user;
  }

  /**
   * 사용자명으로 사용자 정보 조회
   * 
   * 로그인 인증 등에서 사용.
   * 
   * @param username 조회할 사용자명
   * @returns 사용자 상세 정보
   * @throws NotFoundException 해당 사용자명의 사용자가 없는 경우
   */
  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`사용자 이름 ${username}을 찾을 수 없습니다.`);
    }
    return user;
  }

  /**
   * 사용자 정보 수정
   * 
   * 비밀번호가 포함된 경우 자동으로 해싱 처리.
   * 
   * @param id 수정할 사용자 ID
   * @param updateUserDto 수정할 사용자 정보
   * @returns 수정된 사용자 정보
   * @throws NotFoundException 해당 ID의 사용자가 없는 경우
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    // 비밀번호가 변경된 경우 해싱
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다.`);
    }

    return updatedUser;
  }

  /**
   * 사용자 삭제
   * 
   * @param id 삭제할 사용자 ID
   * @returns 삭제된 사용자 정보
   * @throws NotFoundException 해당 ID의 사용자가 없는 경우
   */
  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    
    if (!deletedUser) {
      throw new NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다.`);
    }
    
    return deletedUser;
  }

  /**
   * 사용자에게 역할 추가
   * 
   * 이미 해당 역할을 가지고 있으면 변경 없음.
   * 
   * @param userId 대상 사용자 ID
   * @param role 추가할 역할
   * @returns 업데이트된 사용자 정보
   * @throws NotFoundException 해당 ID의 사용자가 없는 경우
   */
  async addRole(userId: string, role: Role): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }
    
    if (!user.roles.includes(role)) {
      user.roles.push(role);
      return user.save();
    }
    
    return user;
  }

  /**
   * 사용자에게서 역할 제거
   * 
   * 해당 역할이 없으면 변경 없음.
   * 
   * @param userId 대상 사용자 ID
   * @param role 제거할 역할
   * @returns 업데이트된 사용자 정보
   * @throws NotFoundException 해당 ID의 사용자가 없는 경우
   */
  async removeRole(userId: string, role: Role): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }
    
    if (user.roles.includes(role)) {
      user.roles = user.roles.filter(r => r !== role);
      return user.save();
    }
    
    return user;
  }

  /**
   * 사용자 마지막 로그인 시간 업데이트
   * 
   * 로그인 성공 시 호출됨.
   * 
   * @param userId 대상 사용자 ID
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { 
      lastLogin: new Date() 
    }).exec();
  }
} 