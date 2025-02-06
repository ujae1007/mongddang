# docker 실행 가이드

## 사전 작업
1. 로컬 MySQL 서비스 중지 (포트 충돌 방지)

2. Docker Desktop 실행

## 실행 방법

1. image pull
- `docker login`
- `docker pull nimoot/mongddang-backend:2.0`

2. docker-compose 실행
- `docker-compose up --build -d`