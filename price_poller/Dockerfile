FROM oven/bun:latest

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json .

RUN bun install 

COPY . .

CMD ["sh", "-c", "bunx prisma db push && bun run seed.ts && bun run src/index.ts"]