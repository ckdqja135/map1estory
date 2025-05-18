FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 종속성 설치 및 NestJS CLI 전역 설치
RUN npm install && npm install -g @nestjs/cli

# 애플리케이션 소스 코드 복사
COPY . .

# TypeScript 컴파일 및 빌드 (npx 사용)
RUN npm run build

# 컨테이너 시작 시 실행할 명령
CMD ["node", "dist/main"]

# 상태 점검용 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget -q -O- http://localhost:3001/api/health || exit 1 