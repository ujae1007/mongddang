# 1. Node.js 이미지 사용 (빌드 전용)
FROM node:20-alpine AS build

# 2. 작업 디렉토리 설정
WORKDIR /

# 3. package.json과 package-lock.json 복사
COPY frontend/mongddang/package*.json ./
COPY frontend/mongddang/yarn.lock ./

# 4. 의존성 설치
RUN yarn install --frozen-lockfile

# 5. 전체 소스 코드 복사
COPY frontend/mongddang/ ./

RUN yarn build

# 8. Nginx 이미지 사용 (정적 파일 서빙용)
FROM nginx:stable-alpine

# 9. Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 10. 빌드된 프론트엔드 파일을 Nginx의 정적 파일 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 11. Nginx가 80 포트에서 요청을 받도록 설정
EXPOSE 80

# 12. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
