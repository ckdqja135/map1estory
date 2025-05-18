import { Model } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
export declare class RewardsService {
    private rewardModel;
    constructor(rewardModel: Model<RewardDocument>);
    create(createRewardDto: CreateRewardDto, userId: string): Promise<Reward>;
    findAll(): Promise<Reward[]>;
    findByEventId(eventId: string): Promise<Reward[]>;
    findOne(id: string): Promise<Reward>;
    update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward>;
    remove(id: string): Promise<Reward>;
}
