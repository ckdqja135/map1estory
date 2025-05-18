import { RewardType } from '../../common/enums/reward-type.enum';
export declare class UpdateRewardDto {
    name?: string;
    description?: string;
    type?: RewardType;
    quantity?: number;
    metadata?: Record<string, any>;
    updatedBy?: string;
}
