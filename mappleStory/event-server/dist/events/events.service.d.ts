import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFilterDto } from './dto/event-filter.dto';
export declare class EventsService {
    private eventModel;
    constructor(eventModel: Model<EventDocument>);
    create(createEventDto: CreateEventDto, userId: string): Promise<Event>;
    findAll(filters?: EventFilterDto): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    remove(id: string): Promise<Event>;
}
