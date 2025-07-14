FROM node:22 AS build

WORKDIR /app
COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production

FROM node:22-alpine AS run

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app
COPY --from=build /app/build /app/build
# COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/node_modules ./node_modules
RUN ulimit -c unlimited
ENTRYPOINT ["node", "build"]