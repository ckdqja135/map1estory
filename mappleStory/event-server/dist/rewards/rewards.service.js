"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reward_schema_1 = require("./schemas/reward.schema");
let RewardsService = class RewardsService {
    rewardModel;
    constructor(rewardModel) {
        this.rewardModel = rewardModel;
    }
    async create(createRewardDto, userId) {
        const createdReward = new this.rewardModel({
            ...createRewardDto,
            eventId: new mongoose_2.Types.ObjectId(createRewardDto.eventId),
            createdBy: userId,
        });
        return createdReward.save();
    }
    async findAll() {
        return this.rewardModel.find().exec();
    }
    async findByEventId(eventId) {
        return this.rewardModel.find({ eventId: new mongoose_2.Types.ObjectId(eventId) }).exec();
    }
    async findOne(id) {
        const reward = await this.rewardModel.findById(id).exec();
        if (!reward) {
            throw new common_1.NotFoundException(`Reward with ID ${id} not found`);
        }
        return reward;
    }
    async update(id, updateRewardDto) {
        const updatedReward = await this.rewardModel
            .findByIdAndUpdate(id, updateRewardDto, { new: true })
            .exec();
        if (!updatedReward) {
            throw new common_1.NotFoundException(`Reward with ID ${id} not found`);
        }
        return updatedReward;
    }
    async remove(id) {
        const deletedReward = await this.rewardModel.findByIdAndDelete(id).exec();
        if (!deletedReward) {
            throw new common_1.NotFoundException(`Reward with ID ${id} not found`);
        }
        return deletedReward;
    }
};
exports.RewardsService = RewardsService;
exports.RewardsService = RewardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reward_schema_1.Reward.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map