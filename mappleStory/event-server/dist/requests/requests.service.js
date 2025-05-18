"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RequestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const request_schema_1 = require("./schemas/request.schema");
const events_service_1 = require("../events/events.service");
const rewards_service_1 = require("../rewards/rewards.service");
const request_status_enum_1 = require("../common/enums/request-status.enum");
const role_enum_1 = require("../common/enums/role.enum");
const event_status_enum_1 = require("../common/enums/event-status.enum");
let RequestsService = RequestsService_1 = class RequestsService {
    requestModel;
    eventsService;
    rewardsService;
    logger = new common_1.Logger(RequestsService_1.name);
    constructor(requestModel, eventsService, rewardsService) {
        this.requestModel = requestModel;
        this.eventsService = eventsService;
        this.rewardsService = rewardsService;
    }
    async create(createRequestDto, userId) {
        this.logger.log(`사용자 ${userId}가 이벤트 ${createRequestDto.eventId}에 대한 보상 요청을 생성합니다.`);
        const event = await this.eventsService.findOne(createRequestDto.eventId);
        this.logger.debug(`이벤트 정보: ${JSON.stringify({
            id: event['_id'] || createRequestDto.eventId,
            name: event.name,
            status: event.status,
            startDate: event.startDate,
            endDate: event.endDate
        })}`);
        if (event.status !== event_status_enum_1.EventStatus.ACTIVE) {
            this.logger.warn(`이벤트 ${event.name}이(가) 활성 상태가 아닙니다. 현재 상태: ${event.status}`);
            throw new common_1.BadRequestException(`이벤트 "${event.name}"가 현재 활성화되어 있지 않아 보상을 요청할 수 없습니다.`);
        }
        const now = new Date();
        if (now < event.startDate || now > event.endDate) {
            this.logger.warn(`현재 시간이 이벤트 기간을 벗어났습니다. 현재: ${now}, 시작: ${event.startDate}, 종료: ${event.endDate}`);
            throw new common_1.BadRequestException(`현재는 이벤트 "${event.name}" 기간이 아닙니다. (${event.startDate.toLocaleDateString()} ~ ${event.endDate.toLocaleDateString()})`);
        }
        const existingRequest = await this.requestModel.findOne({
            userId: userId,
            eventId: new mongoose_2.Types.ObjectId(createRequestDto.eventId),
            status: { $in: [request_status_enum_1.RequestStatus.PENDING, request_status_enum_1.RequestStatus.APPROVED, request_status_enum_1.RequestStatus.COMPLETED] },
        }).exec();
        if (existingRequest) {
            this.logger.warn(`사용자 ${userId}는 이미 이벤트 ${createRequestDto.eventId}에 대한 보상 요청이 있습니다. 요청 ID: ${existingRequest._id}, 상태: ${existingRequest.status}`);
            let errorMessage = '이미 해당 이벤트에 대한 보상 요청이 존재합니다.';
            if (existingRequest.status === request_status_enum_1.RequestStatus.PENDING) {
                errorMessage = '이 이벤트에 대한 요청이 이미 처리 대기 중입니다.';
            }
            else if (existingRequest.status === request_status_enum_1.RequestStatus.APPROVED) {
                errorMessage = '이 이벤트에 대한 요청이 이미 승인되었습니다.';
            }
            else if (existingRequest.status === request_status_enum_1.RequestStatus.COMPLETED) {
                errorMessage = '이 이벤트에 대한 보상을 이미 받았습니다.';
            }
            throw new common_1.BadRequestException(errorMessage);
        }
        this.logger.debug(`이벤트 조건 검증 시작: ${JSON.stringify(event.conditions)}`);
        this.logger.debug(`사용자 메타데이터: ${JSON.stringify(createRequestDto.metadata)}`);
        try {
            await this.verifyEventConditions(event.conditions, userId, createRequestDto.metadata || {});
            this.logger.debug('이벤트 조건 검증 완료');
        }
        catch (error) {
            this.logger.warn(`이벤트 조건 검증 실패: ${error.message}`);
            throw error;
        }
        const rewardObjectIds = [];
        if (createRequestDto.rewardIds && createRequestDto.rewardIds.length > 0) {
            createRequestDto.rewardIds.forEach(id => {
                rewardObjectIds.push(new mongoose_2.Types.ObjectId(id));
            });
            this.logger.debug(`사용자가 지정한 보상: ${createRequestDto.rewardIds.join(', ')}`);
        }
        else {
            const rewards = await this.rewardsService.findByEventId(createRequestDto.eventId);
            rewards.forEach(reward => {
                rewardObjectIds.push(reward._id);
            });
            this.logger.debug(`이벤트의 모든 보상: ${rewardObjectIds.length}개`);
        }
        const createdRequest = new this.requestModel({
            userId,
            eventId: new mongoose_2.Types.ObjectId(createRequestDto.eventId),
            rewardIds: rewardObjectIds,
            status: request_status_enum_1.RequestStatus.PENDING,
            metadata: createRequestDto.metadata || {},
        });
        const savedRequest = await createdRequest.save();
        this.logger.log(`보상 요청이 성공적으로 생성되었습니다. 요청 ID: ${savedRequest._id}`);
        return savedRequest;
    }
    async verifyEventConditions(conditions, userId, metadata) {
        if (conditions.loginDays && (!metadata.loginDays || metadata.loginDays < conditions.loginDays)) {
            this.logger.warn(`로그인 일수 조건 실패. 필요: ${conditions.loginDays}일, 실제: ${metadata.loginDays || 0}일`);
            throw new common_1.BadRequestException(`최소 ${conditions.loginDays}일 연속 로그인이 필요합니다.`);
        }
        if (conditions.signupRequired && !metadata.isSignedUp) {
            this.logger.warn('가입 필요 조건 실패. 사용자가 가입되어 있지 않음');
            throw new common_1.BadRequestException('가입이 필요한 이벤트입니다.');
        }
        if (conditions.inviteFriends && (!metadata.invitedFriends || metadata.invitedFriends < conditions.inviteFriends)) {
            this.logger.warn(`친구 초대 조건 실패. 필요: ${conditions.inviteFriends}명, 실제: ${metadata.invitedFriends || 0}명`);
            throw new common_1.BadRequestException(`최소 ${conditions.inviteFriends}명의 친구 초대가 필요합니다.`);
        }
        if (conditions.minLevel && (!metadata.level || metadata.level < conditions.minLevel)) {
            this.logger.warn(`레벨 조건 실패. 필요: ${conditions.minLevel} 레벨, 실제: ${metadata.level || 0} 레벨`);
            throw new common_1.BadRequestException(`최소 ${conditions.minLevel} 레벨이 필요합니다.`);
        }
        if (conditions.questId && !metadata.completedQuests?.includes(conditions.questId)) {
            this.logger.warn(`퀘스트 완료 조건 실패. 필요한 퀘스트: ${conditions.questId}`);
            throw new common_1.BadRequestException(`퀘스트 ${conditions.questId}를 완료해야 합니다.`);
        }
        if (conditions.requiredItems && (!metadata.items || !this.hasAllItems(metadata.items, conditions.requiredItems))) {
            this.logger.warn(`아이템 보유 조건 실패. 필요한 아이템: ${JSON.stringify(conditions.requiredItems)}`);
            throw new common_1.BadRequestException('필요한 아이템이 부족합니다.');
        }
        this.logger.log(`사용자 ${userId}가 모든 이벤트 조건을 충족합니다.`);
    }
    hasAllItems(userItems, requiredItems) {
        for (const [itemId, requiredCount] of Object.entries(requiredItems)) {
            const userCount = userItems[itemId] || 0;
            if (userCount < requiredCount) {
                return false;
            }
        }
        return true;
    }
    async findAll(filters) {
        const query = {};
        if (filters?.userId) {
            query.userId = filters.userId;
            this.logger.debug(`사용자 ID로 필터링: ${filters.userId}`);
        }
        if (filters?.eventId) {
            query.eventId = new mongoose_2.Types.ObjectId(filters.eventId);
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
            .sort({ createdAt: -1 })
            .exec();
        this.logger.log(`총 ${requests.length}개의 보상 요청을 찾았습니다.`);
        if (filters && Object.keys(filters).length > 0) {
            this.logger.log(`적용된 필터: ${Object.entries(filters)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join(', ')}`);
        }
        return requests;
    }
    async findOne(id) {
        this.logger.log(`보상 요청 ID ${id}를 조회합니다.`);
        const request = await this.requestModel.findById(id)
            .populate('eventId')
            .populate('rewardIds')
            .exec();
        if (!request) {
            this.logger.warn(`보상 요청 ID ${id}를 찾을 수 없습니다.`);
            throw new common_1.NotFoundException(`요청 ID ${id}를 찾을 수 없습니다.`);
        }
        this.logger.log(`보상 요청 ID ${id}를 찾았습니다.`);
        return request;
    }
    async findOneWithAuth(id, userId, userRoles) {
        const request = await this.findOne(id);
        const isOwnRequest = request.userId === userId;
        const hasAdminRole = userRoles && userRoles.some(role => [role_enum_1.Role.ADMIN, role_enum_1.Role.OPERATOR, role_enum_1.Role.AUDITOR].includes(role));
        this.logger.log(`권한 검증: 자신의 요청=${isOwnRequest}, 관리자 역할=${hasAdminRole}`);
        if (!isOwnRequest && !hasAdminRole) {
            this.logger.warn(`사용자 ${userId}는 요청 ${id}에 접근할 권한이 없습니다.`);
            throw new common_1.ForbiddenException('이 보상 요청을 조회할 권한이 없습니다.');
        }
        return request;
    }
    async update(id, updateRequestDto, adminUserId) {
        const updatedRequest = await this.requestModel.findByIdAndUpdate(id, {
            ...updateRequestDto,
            processedBy: adminUserId,
            processingDate: new Date(),
        }, { new: true })
            .populate('eventId')
            .populate('rewardIds')
            .exec();
        if (!updatedRequest) {
            throw new common_1.NotFoundException(`요청 ID ${id}를 찾을 수 없습니다.`);
        }
        return updatedRequest;
    }
    async remove(id) {
        const deletedRequest = await this.requestModel.findByIdAndDelete(id)
            .populate('eventId')
            .populate('rewardIds')
            .exec();
        if (!deletedRequest) {
            throw new common_1.NotFoundException(`요청 ID ${id}를 찾을 수 없습니다.`);
        }
        return deletedRequest;
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = RequestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(request_schema_1.RewardRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        events_service_1.EventsService,
        rewards_service_1.RewardsService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map