"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const compression = require("compression");
dotenv.config();
async function bootstrap() {
    const logger = new common_1.Logger('GatewayServer');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(compression());
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:8080'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    app.setGlobalPrefix('api');
    app.use((req, res, next) => {
        logger.log(`${req.method} ${req.originalUrl}`);
        next();
    });
    const port = process.env.PORT || 4000;
    await app.listen(port);
    logger.log(`게이트웨이 서버가 포트 ${port}에서 실행 중입니다`);
}
bootstrap();
//# sourceMappingURL=main.js.map