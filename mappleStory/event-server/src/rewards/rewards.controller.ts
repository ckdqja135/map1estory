import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from './schemas/reward.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  create(@Body() createRewardDto: CreateRewardDto, @Request() req): Promise<Reward> {
    const userId = req.user.sub;
    return this.rewardsService.create(createRewardDto, userId);
  }

  @Get()
  findAll(): Promise<Reward[]> {
    return this.rewardsService.findAll();
  }

  @Get('event/:eventId')
  findByEventId(@Param('eventId') eventId: string): Promise<Reward[]> {
    return this.rewardsService.findByEventId(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Reward> {
    return this.rewardsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
    @Request() req,
  ): Promise<Reward> {
    const userId = req.user.sub;
    return this.rewardsService.update(id, { ...updateRewardDto, updatedBy: userId });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<Reward> {
    return this.rewardsService.remove(id);
  }
} 