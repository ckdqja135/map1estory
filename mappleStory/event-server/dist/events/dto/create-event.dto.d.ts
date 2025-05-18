import { EventStatus } from '../../common/enums/event-status.enum';
export declare class CreateEventDto {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    conditions: Record<string, any>;
    status?: EventStatus;
}
