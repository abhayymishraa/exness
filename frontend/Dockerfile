FROM oven/bun:latest

WORKDIR /home

RUN bun install -g serve

COPY package.json .

RUN bun install

COPY . .

RUN bun run build  

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]