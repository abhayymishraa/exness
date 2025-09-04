FROM node:22-alpine

WORKDIR /app

RUN npm i -g bun

COPY package.json bun.lockb* ./

RUN bun install

COPY . .

EXPOSE 5000

CMD ["bun", "run", "src/index.ts"]
