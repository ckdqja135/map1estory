import { HttpService } from '../services/http.service';
import { Request } from 'express';
export declare class AuthRoutes {
    private readonly httpService;
    constructor(httpService: HttpService);
    login(body: any): Promise<any>;
    register(body: any): Promise<any>;
    getProfile(req: Request): Promise<any>;
    getUserInfo(id: string, req: Request): Promise<any>;
    getRoles(req: Request): Promise<any>;
    handleAll(req: Request): Promise<any>;
}
