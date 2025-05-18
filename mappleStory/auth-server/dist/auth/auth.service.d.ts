import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
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
    validateToken(token: string): {
        valid: boolean;
        payload: any;
    } | {
        valid: boolean;
        payload?: undefined;
    };
}
