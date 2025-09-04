FROM bun:22-alpine

WORKDIR /home

RUN npm i -g bun

RUN npm i -g serve

COPY package.json .

RUN bun install

RUN bun run build

COPY dist .

EXPOSE 3000

CMD [ "serve", "-s" ]
