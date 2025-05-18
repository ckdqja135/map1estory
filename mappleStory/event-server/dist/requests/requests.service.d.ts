import { Model } from 'mongoose';
import { RewardRequest, RequestDocument } from './schemas/request.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { EventsService } from '../events/events.service';
import { RewardsService } from '../rewards/rewards.service';
import { RequestFilterDto } from './dto/request-filter.dto';
export declare class RequestsService {
    private requestModel;
    private eventsService;
    private rewardsService;
    private readonly logger;
    constructor(requestModel: Model<RequestDocument>, eventsService: EventsService, rewardsService: RewardsService);
    create(createRequestDto: CreateRequestDto, userId: string): Promise<RewardRequest>;
    private verifyEventConditions;
    private hasAllItems;
    findAll(filters?: RequestFilterDto): Promise<RewardRequest[]>;
    findOne(id: string): Promise<RewardRequest>;
    findOneWithAuth(id: string, userId: string, userRoles: string[]): Promise<RewardRequest>;
    update(id: string, updateRequestDto: UpdateRequestDto, adminUserId: string): Promise<RewardRequest>;
    remove(id: string): Promise<RewardRequest>;
}
