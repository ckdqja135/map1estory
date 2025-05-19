# MappleStory 이벤트 보상 시스템

## 프로젝트 소개
이 프로젝트는 게임 내 이벤트 보상 시스템을 **마이크로서비스 아키텍처(MSA)** 로 구현한 백엔드 시스템입니다. NestJS와 MongoDB를 기반으로 하며, Docker를 통해 쉽게 배포할 수 있도록 구성되었습니다.

---

## 시스템 아키텍처

### 마이크로서비스 구성
본 시스템은 다음과 같은 서비스로 구성되어 있습니다.
- **Gateway 서버 (4000번 포트)**: API 게이트웨이 역할을 담당하며, 클라이언트의 요청을 적절한 서비스로 라우팅합니다.
- **Auth 서버 (4001번 포트)**: 사용자 인증 및 계정 관리를 담당합니다.
- **Event 서버 (4003번 포트)**: 이벤트 및 보상 관리를 담당합니다.
- **MongoDB 인스턴스**: 각 서비스별 독립적인 데이터베이스를 제공합니다.
- **Mongo Express (4081번 포트)**: MongoDB 관리를 위한 웹 인터페이스입니다.
---

## 이벤트 설계

### 이벤트 모델
이벤트는 다음과 같은 구조로 설계되었습니다.
``` typescript
interface Event {
  id: string;                // 이벤트 고유 식별자
  title: string;             // 이벤트 제목
  description: string;       // 이벤트 설명
  startDate: Date;           // 이벤트 시작 날짜
  endDate: Date;             // 이벤트 종료 날짜
  conditions: Condition[];   // 이벤트 달성 조건
  rewards: Reward[];         // 이벤트 보상 목록
  isActive: boolean;         // 이벤트 활성화 여부
  createdAt: Date;           // 생성 일시
  updatedAt: Date;           // 수정 일시
}
```

### 보상 모델
보상은 다양한 유형(아이템, 경험치, 재화 등)을 지원하도록 설계되었습니다.
``` typescript
interface Reward {
  type: RewardType;          // 보상 유형 (ITEM, EXP, CURRENCY 등)
  value: number;             // 보상 수량
  itemId?: string;           // 아이템 유형일 경우 아이템 ID
  description: string;       // 보상 설명
}

enum RewardType {
  ITEM = 'ITEM',
  EXP = 'EXP',
  CURRENCY = 'CURRENCY',
  // 추가 보상 유형...
}
```
---

## 조건 검증 방식

### 이벤트 조건 설계
이벤트 달성 조건은 유연하고 확장 가능한 방식으로 설계되었습니다.
``` typescript
interface Condition {
  type: ConditionType;       // 조건 유형 (LEVEL, ITEM_COLLECT, MONSTER_DEFEAT 등)
  targetValue: number;       // 목표 수치
  currentValue?: number;     // 현재 달성 수치 (사용자별로 다름)
  metadata?: any;            // 조건별 추가 정보
}

enum ConditionType {
  LEVEL = 'LEVEL',
  PLAY_TIME = 'PLAY_TIME',
  ITEM_COLLECT = 'ITEM_COLLECT',
  MONSTER_DEFEAT = 'MONSTER_DEFEAT',
  QUEST_COMPLETE = 'QUEST_COMPLETE',
  // 추가 조건 유형...
}
```

### 조건 검증 전략
조건 검증은 **전략 패턴(Strategy Pattern)** 을 사용하여 구현되었습니다. 이를 통해 새로운 조건 유형을 쉽게 추가할 수 있습니다.
``` typescript
// 조건 검증을 위한 인터페이스
interface ConditionValidator {
  validate(user: User, condition: Condition): boolean;
}

// 레벨 조건 검증기
class LevelConditionValidator implements ConditionValidator {
  validate(user: User, condition: Condition): boolean {
    return user.level >= condition.targetValue;
  }
}

// 플레이 시간 조건 검증기
class PlayTimeConditionValidator implements ConditionValidator {
  validate(user: User, condition: Condition): boolean {
    return user.totalPlayTime >= condition.targetValue;
  }
}

// 조건 검증기 팩토리
class ConditionValidatorFactory {
  static getValidator(type: ConditionType): ConditionValidator {
    switch (type) {
      case ConditionType.LEVEL:
        return new LevelConditionValidator();
      case ConditionType.PLAY_TIME:
        return new PlayTimeConditionValidator();
      // 다른 조건 유형...
      default:
        throw new Error(`지원하지 않는 조건 유형: ${type}`);
    }
  }
}
```

---

# API 구조 설계 
### API 게이트웨이 패턴 사용
본 프로젝트에서는 **NestJS 기반의 API 게이트웨이**를 통해 모든 클라이언트 요청을 처리하도록 설계하였습니다. 이 패턴을 선택한 이유는 다음과 같습니다.
먼저, **단일 진입점**을 제공함으로써 클라이언트는 오직 하나의 엔드포인트(`http://localhost:4000`)만 알고 있으면 되며, 내부 서비스 구조가 변경되더라도 클라이언트 측 수정 없이 연동이 가능합니다.
또한, **인증 로직을 게이트웨이에 집중**시켜 각 마이크로서비스가 인증 처리 부담 없이 순수한 비즈니스 로직에 집중할 수 있도록 했습니다. JWT 기반 인증 방식이 적용되며, 게이트웨이는 인증된 요청에 대해서만 `Authorization` 헤더를 포함하여 내부 서비스로 전달합니다.
**요청 라우팅**은 경로 기반으로 이루어지며, 다음과 같은 규칙을 따릅니다.
- `/api/auth/*` 경로 → **Auth 서비스** (사용자 인증 및 관리)
- `/api/events/*` 경로 → **Event 서비스** (이벤트 및 보상 처리)

### RESTful API 설계
API는 리소스 중심의 URL 구조를 따르도록 설계하하여 엔드포인트가 직관적으로 해당 리소스를 표현하도록 구성되도록 하였습니다.
예를 들어, 인증과 관련된 기능은 /api/auth/login과 /api/auth/register와 같은 경로를 통해 제공되며, 이벤트 관련 기능은 /api/events 또는 /api/events/:id와 같이 리소스를 명확하게 나타내는 경로로 접근할 수 있습니다.
---

# 📘 API 목록
## Auth Server (`http://localhost:4001`)
| 메서드 | URL                    | 설명           |
|--------|------------------------|----------------|
| POST   | /api/auth/register     | 사용자 등록    |
| POST   | /api/auth/login        | 사용자 로그인  |

##  Event Server (`http://localhost:4003`)
### 이벤트 관련
| 메서드 | URL                    | 설명               |
|--------|------------------------|--------------------|
| POST   | /api/events            | 이벤트 생성        |
| GET    | /api/events            | 모든 이벤트 조회   |
| GET    | /api/events/:id        | 특정 이벤트 조회   |

### 보상 관련
| 메서드 | URL                    | 설명               |
|--------|------------------------|--------------------|
| POST   | /api/rewards           | 보상 생성          |
| GET    | /api/rewards           | 보상 조회          |

mapleStory.postman_collection.json 파일을 참고하시기 바라며,
gateway-server를 실행한 후에는, 위에 명시된 각 API 요청을 gateway-server의 포트로 변경하여 사용하실 수 있습니다.
----

# 실행 방법
## 개발 환경 설정
### 프로젝트 복제
``` bash
git clone [repository-url]
cd mappleStory
```
Docker 및 Docker Compose 설치 필요 시
``` bash 
Windows: https://docs.docker.com/desktop/install/windows-install/
Linux: https://docs.docker.com/engine/install/
```
### Run
``` bash
# 모든 서비스를 한번에 시작 (백그라운드 모드)
./restart-docker.sh

# 또는 직접 Docker Compose 명령 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 확인
docker-compose logs -f gateway-server
docker-compose logs -f auth-server
docker-compose logs -f event-server

# 특정 컨테이너 접속
docker exec -it mapple-gateway sh 
docker exec -it mapple-event sh 
docker exec -it mapple-auth sh 

# 모든 서비스 중지
docker-compose down
```

### 테스트 실행
``` bash
# 테스트 의존성 설치
./install-test-deps.sh

# 각 서비스별 테스트 실행
cd auth-server
npm test
cd ..

cd event-server
npm test
cd ..

cd gateway-server
npm test
cd ..

# 또는 전체 테스트 한번에 실행
./run-all-tests.sh
```

---

## 향후 추가하고 싶은 부분들
- **서비스 모니터링**: Prometheus와 Grafana를 통한 모니터링 시스템 구축
- **로깅 중앙화**: ELK 스택 도입으로 로그 중앙화 및 분석
- **CI/CD 파이프라인**: Jenkins 또는 GitHub Actions를 통한 자동화된 배포 파이프라인 구축
- **API 문서화**: Swagger/OpenAPI를 통한 API 문서 자동화