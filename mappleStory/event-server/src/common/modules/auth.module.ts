import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        const secretKey = process.env.JWT_SECRET || 'your_secure_jwt_secret_key_here';
        const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
        
        return {
          secret: secretKey,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [JwtAuthGuard, RolesGuard],
  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {} 