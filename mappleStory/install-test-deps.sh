#!/bin/bash

# 현재 디렉토리에서 각 서버 폴더로 이동하여 테스트 의존성 설치

# Auth Server
echo "Installing Auth Server test dependencies..."
cd auth-server
npm install --save-dev mongodb-memory-server @types/supertest
cd ..

# Event Server
echo "Installing Event Server test dependencies..."
cd event-server
npm install --save-dev mongodb-memory-server @types/supertest
cd ..

# Gateway Server
echo "Installing Gateway Server test dependencies..."
cd gateway-server
npm install --save-dev @types/supertest
cd ..

echo "All test dependencies installed!" 