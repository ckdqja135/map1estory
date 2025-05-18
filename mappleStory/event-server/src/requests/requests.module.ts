import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { RewardRequest, RequestSchema } from './schemas/request.schema';
import { EventsModule } from '../events/events.module';
import { RewardsModule } from '../rewards/rewards.module';
import { AuthModule } from '../common/modules/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RequestSchema },
    ]),
    EventsModule,
    RewardsModule,
    AuthModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {} 