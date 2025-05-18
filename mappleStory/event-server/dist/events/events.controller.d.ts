import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFilterDto } from './dto/event-filter.dto';
import { Event } from './schemas/event.schema';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto, req: any): Promise<Event>;
    findAll(filterDto: EventFilterDto): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto, req: any): Promise<Event>;
    remove(id: string): Promise<Event>;
}
