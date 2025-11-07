# FROM node:22 AS build

# WORKDIR /app
# COPY package*.json .

# RUN npm ci

# COPY . .

# RUN npm run build
# RUN npm prune --production

# FROM node:22-alpine AS run

# ENV NODE_ENV=production
# EXPOSE 3000

# WORKDIR /app
# COPY --from=build /app/build /app/build
# COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/node_modules ./node_modules
# RUN ulimit -c unlimited
# ENTRYPOINT ["node", "build"]




FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.* /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/build .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "build" ]
