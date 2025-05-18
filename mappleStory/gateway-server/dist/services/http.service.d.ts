import { ConfigService } from '@nestjs/config';
export declare class HttpService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private getServiceUrl;
    forwardRequest(service: 'auth' | 'event', method: string, endpoint: string, data?: any, headers?: any): Promise<any>;
}
