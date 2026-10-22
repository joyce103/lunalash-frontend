# 第一階段：使用 Node.js 22 編譯 Vue (2026/10 安全更新，修補 10 項漏洞)
FROM node:22.23.4-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二階段：使用 Nginx 伺服器 (2026/10 安全更新，修補 5 項中度漏洞)
FROM nginx:1.30.6-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80