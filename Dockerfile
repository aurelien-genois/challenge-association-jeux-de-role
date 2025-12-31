FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY ./ ./

RUN pnpm db:generate

# RUN pnpm build if use "start:prod" instead of "start:dev"

CMD ["pnpm", "start:dev"]