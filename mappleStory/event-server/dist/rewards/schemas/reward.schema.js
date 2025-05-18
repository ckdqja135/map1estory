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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardSchema = exports.Reward = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reward_type_enum_1 = require("../../common/enums/reward-type.enum");
let Reward = class Reward {
    name;
    description;
    type;
    quantity;
    eventId;
    metadata;
    createdBy;
    updatedBy;
};
exports.Reward = Reward;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reward.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reward.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, enum: reward_type_enum_1.RewardType }),
    __metadata("design:type", String)
], Reward.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Reward.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Schema.Types.ObjectId, ref: 'Event' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Reward.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Reward.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reward.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reward.prototype, "updatedBy", void 0);
exports.Reward = Reward = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reward);
exports.RewardSchema = mongoose_1.SchemaFactory.createForClass(Reward);
//# sourceMappingURL=reward.schema.js.map