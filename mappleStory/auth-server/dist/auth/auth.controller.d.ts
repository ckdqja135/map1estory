import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: unknown;
            username: string;
            email: string;
            roles: import("../common/enums/role.enum").Role[];
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            roles: any;
        };
    }>;
    getProfile(req: any): any;
    validateToken(token: string): Promise<{
        valid: boolean;
        payload: any;
    } | {
        valid: boolean;
        payload?: undefined;
    }>;
}
