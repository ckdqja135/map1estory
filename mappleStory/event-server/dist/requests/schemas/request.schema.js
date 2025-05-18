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
exports.RequestSchema = exports.RewardRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const request_status_enum_1 = require("../../common/enums/request-status.enum");
let RewardRequest = class RewardRequest {
    userId;
    eventId;
    rewardIds;
    status;
    processedBy;
    processingDate;
    metadata;
};
exports.RewardRequest = RewardRequest;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], RewardRequest.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Schema.Types.ObjectId, ref: 'Event' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], RewardRequest.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Reward' }] }),
    __metadata("design:type", Array)
], RewardRequest.prototype, "rewardIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: request_status_enum_1.RequestStatus, default: request_status_enum_1.RequestStatus.PENDING }),
    __metadata("design:type", String)
], RewardRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RewardRequest.prototype, "processedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], RewardRequest.prototype, "processingDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], RewardRequest.prototype, "metadata", void 0);
exports.RewardRequest = RewardRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], RewardRequest);
exports.RequestSchema = mongoose_1.SchemaFactory.createForClass(RewardRequest);
//# sourceMappingURL=request.schema.js.map