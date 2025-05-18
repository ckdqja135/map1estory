"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');
    await app.listen(3003);
    console.log(`이벤트 서비스가 http://localhost:3003/api 에서 실행 중입니다.`);
}
bootstrap();
//# sourceMappingURL=main.js.map