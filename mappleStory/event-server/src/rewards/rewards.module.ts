import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { AuthModule } from '../common/modules/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
    AuthModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {} 