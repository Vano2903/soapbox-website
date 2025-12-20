FROM node:24 AS build

WORKDIR /app
COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production

FROM node:24-alpine AS run

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
RUN ulimit -c unlimited
ENTRYPOINT ["node", "build"]




# FROM node:24-alpine AS base

# WORKDIR /app
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY package* /app
# COPY pnpm* /app

# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# COPY . .
# RUN pnpm run build


# # FROM node:22-alpine AS run

# # ENV NODE_ENV=production
# # EXPOSE 3000

# # WORKDIR /app
# # COPY --from=build /app/build /app/build
# # COPY --from=build /app/package.json ./package.json
# # COPY --from=build /app/node_modules ./node_modules
# # RUN ulimit -c unlimited
# # ENTRYPOINT ["node", "build"]



# FROM base
# COPY --from=prod-deps /app/node_modules /app/node_modules
# # COPY --from=build /app/dist /app/dist
# COPY --from=build /app/build /app/build
# COPY --from=build /app/package.json ./package.json

# RUN ulimit -c unlimited
# EXPOSE 3000
# CMD [ "node", "build" ]