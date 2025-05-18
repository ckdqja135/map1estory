import { HttpService } from '../services/http.service';
import { Request } from 'express';
export declare class EventRoutes {
    private readonly httpService;
    constructor(httpService: HttpService);
    getAllEvents(query: any, req: Request): Promise<any>;
    getEventById(id: string, req: Request): Promise<any>;
    createEvent(body: any, req: Request): Promise<any>;
    updateEvent(id: string, body: any, req: Request): Promise<any>;
    deleteEvent(id: string, req: Request): Promise<any>;
    getAllRewards(req: Request): Promise<any>;
    createReward(body: any, req: Request): Promise<any>;
    createEventRequest(body: any, req: Request): Promise<any>;
    getUserRewards(req: Request): Promise<any>;
    handleAll(req: Request): Promise<any>;
}
