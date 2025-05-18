import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async create(createRewardDto: CreateRewardDto, userId: string): Promise<Reward> {
    const createdReward = new this.rewardModel({
      ...createRewardDto,
      eventId: new Types.ObjectId(createRewardDto.eventId),
      createdBy: userId,
    });
    return createdReward.save();
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }

  async findByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId: new Types.ObjectId(eventId) }).exec();
  }

  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(id).exec();
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return reward;
  }

  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    const updatedReward = await this.rewardModel
      .findByIdAndUpdate(id, updateRewardDto, { new: true })
      .exec();
    if (!updatedReward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return updatedReward;
  }

  async remove(id: string): Promise<Reward> {
    const deletedReward = await this.rewardModel.findByIdAndDelete(id).exec();
    if (!deletedReward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return deletedReward;
  }
} 