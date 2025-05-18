import { BadRequestException, Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRequest, RequestDocument } from './schemas/request.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { EventsService } from '../events/events.service';
import { RewardsService } from '../rewards/rewards.service';
import { RequestStatus } from '../common/enums/request-status.enum';
import { RequestFilterDto } from './dto/request-filter.dto';
import { Role } from '../common/enums/role.enum';
import { EventStatus } from '../common/enums/event-status.enum';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);
  
  constructor(
    @InjectModel(RewardRequest.name)
    private requestModel: Model<RequestDocument>,
    private eventsService: EventsService,
    private rewardsService: RewardsService,
  ) {}

  async create(createRequestDto: CreateRequestDto, userId: string): Promise<RewardRequest> {
    this.logger.log(`사용자 ${userId}가 이벤트 ${createRequestDto.eventId}에 대한 보상 요청을 생성합니다.`);
    
    // 이벤트 유효성 검사
    const event = await this.eventsService.findOne(createRequestDto.eventId);
    this.logger.debug(`이벤트 정보: ${JSON.stringify({
      id: event['_id'] || createRequestDto.eventId,
      name: event.name,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate
    })}`);
    
    // 이벤트 활성화 상태 확인
    if (event.status !== EventStatus.ACTIVE) {
      this.logger.warn(`이벤트 ${event.name}이(가) 활성 상태가 아닙니다. 현재 상태: ${event.status}`);
      throw new BadRequestException(`이벤트 "${event.name}"가 현재 활성화되어 있지 않아 보상을 요청할 수 없습니다.`);
    }
    
    // 이벤트 기간 확인
    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      this.logger.warn(`현재 시간이 이벤트 기간을 벗어났습니다. 현재: ${now}, 시작: ${event.startDate}, 종료: ${event.endDate}`);
      throw new BadRequestException(`현재는 이벤트 "${event.name}" 기간이 아닙니다. (${event.startDate.toLocaleDateString()} ~ ${event.endDate.toLocaleDateString()})`);
    }
    
    // 중복 요청 확인 (REJECTED 상태가 아닌 모든 요청 검사)
    const existingRequest = await this.requestModel.findOne({
      userId: userId,
      eventId: new Types.ObjectId(createRequestDto.eventId),
      status: { $in: [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.COMPLETED] },
    }).exec();
    
    if (existingRequest) {
      this.logger.warn(`사용자 ${userId}는 이미 이벤트 ${createRequestDto.eventId}에 대한 보상 요청이 있습니다. 요청 ID: ${existingRequest._id}, 상태: ${existingRequest.status}`);
      
      let errorMessage = '이미 해당 이벤트에 대한 보상 요청이 존재합니다.';
      if (existingRequest.status === RequestStatus.PENDING) {
        errorMessage = '이 이벤트에 대한 요청이 이미 처리 대기 중입니다.';
      } else if (existingRequest.status === RequestStatus.APPROVED) {
        errorMessage = '이 이벤트에 대한 요청이 이미 승인되었습니다.';
      } else if (existingRequest.status === RequestStatus.COMPLETED) {
        errorMessage = '이 이벤트에 대한 보상을 이미 받았습니다.';
      }
      
      throw new BadRequestException(errorMessage);
    }

    // 이벤트 조건 충족 검증
    this.logger.debug(`이벤트 조건 검증 시작: ${JSON.stringify(event.conditions)}`);
    this.logger.debug(`사용자 메타데이터: ${JSON.stringify(createRequestDto.metadata)}`);
    
    try {
      await this.verifyEventConditions(event.conditions, userId, createRequestDto.metadata || {});
      this.logger.debug('이벤트 조건 검증 완료');
    } catch (error) {
      this.logger.warn(`이벤트 조건 검증 실패: ${error.message}`);
      throw error; // 오류 전파
    }

    // 보상 목록 가져오기 (rewardIds가 제공되지 않은 경우 이벤트의 모든 보상)
    const rewardObjectIds: Types.ObjectId[] = [];
    if (createRequestDto.rewardIds && createRequestDto.rewardIds.length > 0) {
      createRequestDto.rewardIds.forEach(id => {
        rewardObjectIds.push(new Types.ObjectId(id));
      });
      this.logger.debug(`사용자가 지정한 보상: ${createRequestDto.rewardIds.join(', ')}`);
    } else {
      const rewards = await this.rewardsService.findByEventId(createRequestDto.eventId);
      rewards.forEach(reward => {
        rewardObjectIds.push((reward as any)._id);
      });
      this.logger.debug(`이벤트의 모든 보상: ${rewardObjectIds.length}개`);
    }

    // 보상 요청 생성
    const createdRequest = new this.requestModel({
      userId,
      eventId: new Types.ObjectId(createRequestDto.eventId),
      rewardIds: rewardObjectIds,
      status: RequestStatus.PENDING,
      metadata: createRequestDto.metadata || {},
    });

    const savedRequest = await createdRequest.save();
    this.logger.log(`보상 요청이 성공적으로 생성되었습니다. 요청 ID: ${savedRequest._id}`);
    return savedRequest;
  }

  // 이벤트 조건 검증 로직
  private async verifyEventConditions(
    conditions: Record<string, any>, 
    userId: string, 
    metadata: Record<string, any>
  ): Promise<void> {
    // 실제 구현에서는 외부 시스템이나 데이터베이스를 통해 검증
    // 여기서는 예시로 몇 가지 조건을 검증

    // 로그인 일수 조건
    if (conditions.loginDays && (!metadata.loginDays || metadata.loginDays < conditions.loginDays)) {
      this.logger.warn(`로그인 일수 조건 실패. 필요: ${conditions.loginDays}일, 실제: ${metadata.loginDays || 0}일`);
      throw new BadRequestException(`최소 ${conditions.loginDays}일 연속 로그인이 필요합니다.`);
    }

    // 가입 필요 조건
    if (conditions.signupRequired && !metadata.isSignedUp) {
      this.logger.warn('가입 필요 조건 실패. 사용자가 가입되어 있지 않음');
      throw new BadRequestException('가입이 필요한 이벤트입니다.');
    }

    // 친구 초대 조건
    if (conditions.inviteFriends && (!metadata.invitedFriends || metadata.invitedFriends < conditions.inviteFriends)) {
      this.logger.warn(`친구 초대 조건 실패. 필요: ${conditions.inviteFriends}명, 실제: ${metadata.invitedFriends || 0}명`);
      throw new BadRequestException(`최소 ${conditions.inviteFriends}명의 친구 초대가 필요합니다.`);
    }

    // 레벨 조건
    if (conditions.minLevel && (!metadata.level || metadata.level < conditions.minLevel)) {
      this.logger.warn(`레벨 조건 실패. 필요: ${conditions.minLevel} 레벨, 실제: ${metadata.level || 0} 레벨`);
      throw new BadRequestException(`최소 ${conditions.minLevel} 레벨이 필요합니다.`);
    }

    // 퀘스트 완료 조건
    if (conditions.questId && !metadata.completedQuests?.includes(conditions.questId)) {
      this.logger.warn(`퀘스트 완료 조건 실패. 필요한 퀘스트: ${conditions.questId}`);
      throw new BadRequestException(`퀘스트 ${conditions.questId}를 완료해야 합니다.`);
    }

    // 아이템 보유 조건
    if (conditions.requiredItems && (!metadata.items || !this.hasAllItems(metadata.items, conditions.requiredItems))) {
      this.logger.warn(`아이템 보유 조건 실패. 필요한 아이템: ${JSON.stringify(conditions.requiredItems)}`);
      throw new BadRequestException('필요한 아이템이 부족합니다.');
    }

    this.logger.log(`사용자 ${userId}가 모든 이벤트 조건을 충족합니다.`);
  }

  // 사용자가 모든 필요 아이템을 보유하는지 확인
  private hasAllItems(userItems: Record<string, number>, requiredItems: Record<string, number>): boolean {
    for (const [itemId, requiredCount] of Object.entries(requiredItems)) {
      const userCount = userItems[itemId] || 0;
      if (userCount < requiredCount) {
        return false;
      }
    }
    return true;
  }

  async findAll(filters?: RequestFilterDto): Promise<RewardRequest[]> {
    const query: any = {};
    
    if (filters?.userId) {
      query.userId = filters.userId;
      this.logger.debug(`사용자 ID로 필터링: ${filters.userId}`);
    }
    
    if (filters?.eventId) {
      query.eventId = new Types.ObjectId(filters.eventId);
      this.logger.debug(`이벤트 ID로 필터링: ${filters.eventId}`);
    }
    
    if (filters?.status) {
      query.status = filters.status;
      this.logger.debug(`상태로 필터링: ${filters.status}`);
    }
    
    this.logger.debug(`보상 요청 조회 쿼리: ${JSON.stringify(query)}`);
    const requests = await this.requestModel.find(query)
      .populate('eventId')
      .populate('rewardIds')
      .sort({ createdAt: -1 }) // 최신순 정렬
      .exec();
      
    this.logger.log(`총 ${requests.length}개의 보상 요청을 찾았습니다.`);
    
    // 필터 적용에 대한 정보 로깅
    if (filters && Object.keys(filters).length > 0) {
      this.logger.log(`적용된 필터: ${
        Object.entries(filters)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${value}`)
          .join(', ')
      }`);
    }
    
    return requests;
  }

  async findOne(id: string): Promise<RewardRequest> {
    this.logger.log(`보상 요청 ID ${id}를 조회합니다.`);
    const request = await this.requestModel.findById(id)
      .populate('eventId')
      .populate('rewardIds')
      .exec();
      
    if (!request) {
      this.logger.warn(`보상 요청 ID ${id}를 찾을 수 없습니다.`);
      throw new NotFoundException(`요청 ID ${id}를 찾을 수 없습니다.`);
    }
    
    this.logger.log(`보상 요청 ID ${id}를 찾았습니다.`);
    return request;
  }

  async findOneWithAuth(id: string, userId: string, userRoles: string[]): Promise<RewardRequest> {
    const request = await this.findOne(id);
    
    // 자신의 요청이거나 관리 권한이 있는 사용자인지 확인
    const isOwnRequest = request.userId === userId;
    const hasAdminRole = userRoles && userRoles.some(role => 
      [Role.ADMIN, Role.OPERATOR, Role.AUDITOR].includes(role as Role)
    );
    
    this.logger.log(`권한 검증: 자신의 요청=${isOwnRequest}, 관리자 역할=${hasAdminRole}`);
    
    if (!isOwnRequest && !hasAdminRole) {
      this.logger.warn(`사용자 ${userId}는 요청 ${id}에 접근할 권한이 없습니다.`);
      throw new ForbiddenException('이 보상 요청을 조회할 권한이 없습니다.');
    }
    
    return request;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto, adminUserId: string): Promise<RewardRequest> {
    const updatedRequest = await this.requestModel.findByIdAndUpdate(
      id,
      {
        ...updateRequestDto,
        processedBy: adminUserId,
        processingDate: new Date(),
      },
      { new: true },
    )
    .populate('eventId')
    .populate('rewardIds')
    .exec();
    
    if (!updatedRequest) {
      throw new NotFoundException(`요청 ID ${id}를 찾을 수 없습니다.`);
    }
    
    return updatedRequest;
  }

  async remove(id: string): Promise<RewardRequest> {
    const deletedRequest = await this.requestModel.findByIdAndDelete(id)
      .populate('eventId')
      .populate('rewardIds')
      .exec();
      
    if (!deletedRequest) {
      throw new NotFoundException(`요청 ID ${id}를 찾을 수 없습니다.`);
    }
    
    return deletedRequest;
  }
} 