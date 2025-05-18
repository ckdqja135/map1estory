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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_schema_1 = require("./schemas/event.schema");
let EventsService = class EventsService {
    eventModel;
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async create(createEventDto, userId) {
        const createdEvent = new this.eventModel({
            ...createEventDto,
            createdBy: userId,
        });
        return createdEvent.save();
    }
    async findAll(filters) {
        const query = filters ? { ...filters } : {};
        return this.eventModel.find(query).exec();
    }
    async findOne(id) {
        const event = await this.eventModel.findById(id).exec();
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }
    async update(id, updateEventDto) {
        const updatedEvent = await this.eventModel
            .findByIdAndUpdate(id, updateEventDto, { new: true })
            .exec();
        if (!updatedEvent) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        return updatedEvent;
    }
    async remove(id) {
        const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
        if (!deletedEvent) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        return deletedEvent;
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EventsService);
//# sourceMappingURL=events.service.js.map