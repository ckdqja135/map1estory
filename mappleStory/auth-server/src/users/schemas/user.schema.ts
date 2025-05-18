/**
 * 사용자 데이터 모델 스키마
 * 
 * MongoDB에 저장될 사용자 정보의 스키마 정의.
 * 사용자명, 비밀번호, 이메일, 역할, 활성화 상태 등의 정보 포함.
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  /**
   * 사용자 로그인 아이디
   * 고유값으로 중복 불가
   */
  @Prop({ required: true, unique: true })
  username: string;

  /**
   * 사용자 비밀번호
   * 해시된 형태로 저장됨
   */
  @Prop({ required: true })
  password: string; // 해시된 비밀번호 저장

  /**
   * 사용자 이메일
   * 고유값으로 중복 불가
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * 사용자 전체 이름
   * 선택 사항
   */
  @Prop()
  fullName?: string;

  /**
   * 사용자 역할 목록
   * 기본값은 일반 사용자(USER)
   */
  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  /**
   * 계정 활성화 상태
   * 기본값은 활성화(true)
   */
  @Prop({ default: true })
  isActive: boolean;

  /**
   * 마지막 로그인 시간
   * 로그인 시 자동 갱신
   */
  @Prop()
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * MongoDB ObjectId를 문자열 ID로 변환하는 가상 필드 설정
 * 클라이언트 응답 시 _id 대신 id로 사용 가능
 */
UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

/**
 * JSON 변환 설정
 * 가상 필드 포함 및 불필요한 필드 제거
 */
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  }
});

/**
 * toObject 변환 설정
 * 가상 필드 포함 및 불필요한 필드 제거
 */
// toObject 변환 시 가상 필드 포함
UserSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  }
}); 