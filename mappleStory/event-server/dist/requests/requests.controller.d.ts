import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RewardRequest } from './schemas/request.schema';
import { RequestFilterDto } from './dto/request-filter.dto';
export declare class RequestsController {
    private readonly requestsService;
    private readonly logger;
    constructor(requestsService: RequestsService);
    create(createRequestDto: CreateRequestDto, req: any): Promise<RewardRequest>;
    findAll(filters: RequestFilterDto, req: any): Promise<RewardRequest[]>;
    findByUserId(userId: string, filters: RequestFilterDto, req: any): Promise<RewardRequest[]>;
    findOne(id: string, req: any): Promise<RewardRequest>;
}
