/**
 * 게이트웨이 서버의 메인 모듈
 * 
 * Gateway 서버는 클라이언트의 요청을 받아 적절한 마이크로서비스(Auth, Event)로 라우팅.
 * 이 모듈은 필요한 모든 컴포넌트들을 등록하고 의존성을 설정.
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from './config/config.module';
import { ConfigService } from '@nestjs/config';
import { AuthRoutes } from './routes/auth.routes';
import { EventRoutes } from './routes/event.routes';
import { HttpService } from './services/http.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback_secret_key',
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h' 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AuthRoutes, EventRoutes],
  providers: [
    AppService, 
    HttpService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AppModule {}
