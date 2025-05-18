import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    private readonly publicEndpoints;
    constructor(jwtService: JwtService, configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
    private isPublicEndpoint;
    private requiresAdminRole;
    private hasAdminRole;
}
