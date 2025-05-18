#!/bin/bash

# 실행 중인 모든 컨테이너 중지
docker-compose down

# 모든 볼륨 제거
docker volume rm mongodb_auth_data mongodb_event_data

# Docker 시스템 정리
docker system prune -f 