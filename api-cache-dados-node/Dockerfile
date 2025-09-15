FROM node:20-alpine

WORKDIR /app

COPY src/app.js .
COPY src/dados.txt .
COPY src/package*.json .  

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "app.js"]