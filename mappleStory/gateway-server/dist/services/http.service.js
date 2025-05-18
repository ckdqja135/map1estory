"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HttpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let HttpService = HttpService_1 = class HttpService {
    configService;
    logger = new common_1.Logger(HttpService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    getServiceUrl(service) {
        const serviceUrls = {
            auth: this.configService.get('AUTH_SERVICE_URL') || 'http://localhost:3001',
            event: this.configService.get('EVENT_SERVICE_URL') || 'http://localhost:3003',
        };
        return serviceUrls[service];
    }
    async forwardRequest(service, method, endpoint, data, headers) {
        const baseUrl = this.getServiceUrl(service);
        const adjustedEndpoint = `/api${endpoint}`;
        const url = `${baseUrl}${adjustedEndpoint}`;
        const methodUpperCase = method.toUpperCase();
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };
        this.logger.log(`요청 전달: ${method.toUpperCase()} ${url}`);
        const config = {
            method: methodUpperCase,
            url,
            headers: requestHeaders,
            ...(methodUpperCase === 'GET' ? { params: data } : { data }),
            timeout: 30000,
        };
        try {
            const response = await (0, axios_1.default)(config);
            this.logger.log(`응답 수신: ${response.status} - ${url}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`요청 실패: ${url} - ${error.message}`);
            if (error.response) {
                throw new common_1.HttpException(error.response.data, error.response.status);
            }
            if (error.code === 'ECONNREFUSED') {
                throw new common_1.HttpException(`${service} 서비스가 응답하지 않습니다. 서비스 상태를 확인해주세요.`, 503);
            }
            throw new common_1.HttpException('서비스 요청 실패', 500);
        }
    }
};
exports.HttpService = HttpService;
exports.HttpService = HttpService = HttpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HttpService);
//# sourceMappingURL=http.service.js.map