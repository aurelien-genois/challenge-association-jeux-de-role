FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Allow Prisma + bcrypt + engines to run postinstall scripts
RUN pnpm config set enable-pre-post-scripts true

# Approve required build scripts
RUN pnpm approve-builds prisma @prisma/engines bcrypt

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY ./ ./

RUN pnpm db:generate

# RUN pnpm build if use "start:prod" instead of "start:dev"

CMD ["pnpm", "start:dev"]