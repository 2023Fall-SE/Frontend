# 使用官方 Python 映像
FROM node:latest

# 設定工作目錄
WORKDIR /app

COPY . .

RUN yarn install && yarn cache clean

# 開放 FastAPI 服務埠
EXPOSE 8080

# 定義啟動應用程式的指令
CMD [ "yarn", "start" ]