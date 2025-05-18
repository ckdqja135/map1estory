import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from './schemas/reward.schema';
export declare class RewardsController {
    private readonly rewardsService;
    constructor(rewardsService: RewardsService);
    create(createRewardDto: CreateRewardDto, req: any): Promise<Reward>;
    findAll(): Promise<Reward[]>;
    findByEventId(eventId: string): Promise<Reward[]>;
    findOne(id: string): Promise<Reward>;
    update(id: string, updateRewardDto: UpdateRewardDto, req: any): Promise<Reward>;
    remove(id: string): Promise<Reward>;
}
