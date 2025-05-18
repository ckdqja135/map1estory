/**
 * 마이크로서비스 간 HTTP 통신을 담당하는 서비스
 * 
 * Gateway 서버가 Auth 및 Event 마이크로서비스와 통신하기 위한 HTTP 클라이언트 서비스.
 * 클라이언트 요청을 적절한 마이크로서비스로 전달하고 응답을 처리.
 * 오류 처리, 로깅, 타임아웃 관리 등의 기능 포함.
 */
import { Injectable, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * 마이크로서비스의 기본 URL을 환경 설정에서 가져옴.
   * 
   * @param service 대상 마이크로서비스 (auth 또는 event)
   * @returns 마이크로서비스의 기본 URL
   */
  private getServiceUrl(service: 'auth' | 'event'): string {
    const serviceUrls = {
      auth: this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001',
      event: this.configService.get<string>('EVENT_SERVICE_URL') || 'http://localhost:3003',
    };

    return serviceUrls[service];
  }

  /**
   * 요청을 지정된 마이크로서비스로 전달
   * 
   * 클라이언트 요청을 적절한 마이크로서비스에 전달하고 응답을 반환.
   * 모든 요청에 /api 접두사를 자동으로 추가하고, 인증 헤더를 유지.
   * 오류가 발생하면 적절한 예외를 발생시키고 로깅.
   * 
   * @param service 대상 마이크로서비스 (auth 또는 event)
   * @param method HTTP 메서드 (get, post, put, delete 등)
   * @param endpoint 마이크로서비스의 API 엔드포인트 경로
   * @param data 요청 데이터 (GET 요청의 경우 쿼리 파라미터, 나머지는 요청 본문)
   * @param headers 요청 헤더 (인증 토큰 등)
   * @returns 마이크로서비스의 응답 데이터
   * @throws HttpException 요청 실패 시
   */
  async forwardRequest(
    service: 'auth' | 'event',
    method: string,
    endpoint: string,
    data?: any,
    headers?: any,
  ): Promise<any> {
    const baseUrl = this.getServiceUrl(service);
    
    // 모든 마이크로서비스에 /api 접두사 추가
    const adjustedEndpoint = `/api${endpoint}`;
    const url = `${baseUrl}${adjustedEndpoint}`;
    
    const methodUpperCase = method.toUpperCase() as Method;

    // 사용자 인증 정보 포함 여부 확인
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    this.logger.log(`요청 전달: ${method.toUpperCase()} ${url}`);

    const config: AxiosRequestConfig = {
      method: methodUpperCase,
      url,
      headers: requestHeaders,
      ...(methodUpperCase === 'GET' ? { params: data } : { data }),
      timeout: 30000, // 30초 타임아웃 설정
    };

    try {
      const response: AxiosResponse = await axios(config);
      this.logger.log(`응답 수신: ${response.status} - ${url}`);
      return response.data;
    } catch (error) {
      this.logger.error(`요청 실패: ${url} - ${error.message}`);
      
      // 마이크로서비스가 응답을 반환한 경우 해당 오류 정보 전달
      if (error.response) {
        throw new HttpException(
          error.response.data,
          error.response.status,
        );
      }
      
      // 마이크로서비스 연결 실패 시 503 Service Unavailable 반환
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(`${service} 서비스가 응답하지 않습니다. 서비스 상태를 확인해주세요.`, 503);
      }
      
      // 기타 예상치 못한 오류 처리
      throw new HttpException('서비스 요청 실패', 500);
    }
  }
} 