# 使用官方 Python 映像
FROM node:latest

# 設定工作目錄
WORKDIR /app

COPY . .

RUN yarn install && yarn cache clean

EXPOSE 3000

# 定義啟動應用程式的指令
CMD [ "yarn", "start" ]