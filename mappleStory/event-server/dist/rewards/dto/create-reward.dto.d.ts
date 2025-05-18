import { RewardType } from '../../common/enums/reward-type.enum';
export declare class CreateRewardDto {
    name: string;
    description?: string;
    type: RewardType;
    quantity: number;
    eventId: string;
    metadata?: Record<string, any>;
}
