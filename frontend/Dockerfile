FROM oven/bun:latest

WORKDIR /home

RUN bun install -g serve

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
