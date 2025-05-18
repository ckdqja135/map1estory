"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const requests_controller_1 = require("./requests.controller");
const requests_service_1 = require("./requests.service");
const request_schema_1 = require("./schemas/request.schema");
const events_module_1 = require("../events/events.module");
const rewards_module_1 = require("../rewards/rewards.module");
const auth_module_1 = require("../common/modules/auth.module");
let RequestsModule = class RequestsModule {
};
exports.RequestsModule = RequestsModule;
exports.RequestsModule = RequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: request_schema_1.RewardRequest.name, schema: request_schema_1.RequestSchema },
            ]),
            events_module_1.EventsModule,
            rewards_module_1.RewardsModule,
            auth_module_1.AuthModule,
        ],
        controllers: [requests_controller_1.RequestsController],
        providers: [requests_service_1.RequestsService],
        exports: [requests_service_1.RequestsService],
    })
], RequestsModule);
//# sourceMappingURL=requests.module.js.map