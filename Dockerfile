# 第一階段：使用 Node.js 編譯 Vue
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二階段：使用 Nginx 伺服器
FROM nginx:alpine
# 將剛剛編譯好的 dist 資料夾放到 Nginx 裡面
COPY --from=build /app/dist /usr/share/nginx/html
# 覆蓋 Nginx 預設設定檔
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80