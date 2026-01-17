# FROM node:24-alpine AS base

# WORKDIR /app
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY package* /app
# COPY pnpm* /app

# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# COPY . .
# RUN pnpm run build


# FROM base
# # COPY --from=base /usr/local/bin/pnpm /usr/local/bin/pnpm
# # COPY --from=base /usr/local/bin/pnpx /usr/local/bin/pnpx

# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY *json *ts *js *yaml /app/
# COPY --from=build /app/build /app/build
# COPY --from=build /app/.svelte-kit /app/.svelte-kit
# COPY --from=build /app/package.json /app/package.json

# RUN ulimit -c unlimited
# EXPOSE 3000
# WORKDIR /app
# CMD [ "pnpm","run","preview" ]

# FROM node:24 AS build

# WORKDIR /app
# COPY package*.json .

# RUN npm ci

# COPY . .

# RUN npm run build
# RUN npm prune --production

# FROM node:24 AS run

# ENV NODE_ENV=production
# EXPOSE 3000

# WORKDIR /app
# COPY --from=build /app/build /app/build
# COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/node_modules ./node_modules
# RUN ulimit -c unlimited
# ENTRYPOINT ["node", "build"]
# ENTRYPOINT ["node","./node_modules/.bin/sirv", "build", "--host", "0.0.0.0", "--port", "3000"]


FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
EXPOSE 3000
ENV BODY_SIZE_LIMIT=10M
CMD [ "node", "build" ]