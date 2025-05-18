"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');
    const port = configService.get('PORT', 3001);
    await app.listen(port);
    console.log(`Auth 서비스가 http://localhost:${port}/api 에서 실행 중입니다`);
}
bootstrap();
//# sourceMappingURL=main.js.map