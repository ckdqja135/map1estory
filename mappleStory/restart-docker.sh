#!/bin/bash

# 실행 중인 컨테이너 중지
docker-compose down

# 새 설정으로 컨테이너 시작
docker-compose up -d 