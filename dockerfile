# 使用官方 Python 映像
FROM node:latest

# 設定工作目錄
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# 定義啟動應用程式的指令
CMD npm test -- --watchAll=false && npm start