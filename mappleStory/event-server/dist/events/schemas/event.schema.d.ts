import { Document } from 'mongoose';
import { EventStatus } from '../../common/enums/event-status.enum';
export type EventDocument = Event & Document;
export declare class Event {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    conditions: Record<string, any>;
    status: EventStatus;
    createdBy: string;
    updatedBy: string;
}
export declare const EventSchema: import("mongoose").Schema<Event, import("mongoose").Model<Event, any, any, any, Document<unknown, any, Event, any> & Event & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Event, Document<unknown, {}, import("mongoose").FlatRecord<Event>, {}> & import("mongoose").FlatRecord<Event> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
