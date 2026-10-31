# Front client: static build served by the back
FROM node:24.22.1 AS front

WORKDIR /front

COPY front/package.json front/package-lock.json ./
RUN npm ci

COPY front/ ./
RUN npm run build

# Back: built on Alpine like the runtime, so native modules (bcrypt) match
# its libc. bcrypt has no prebuilt binary for every platform, so it may
# compile from source.
FROM node:24.22.1-alpine AS back

RUN apk add --no-cache python3 make g++

WORKDIR /back

COPY back/package.json back/package-lock.json ./
RUN npm ci

COPY back/ ./
RUN npm run build && npm prune --omit=dev

FROM node:24.22.1-alpine

RUN apk add --no-cache tini curl

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app

COPY back/package.json ./
COPY --from=back /back/build ./build
COPY --from=back /back/node_modules ./node_modules
COPY --from=front /front/build ./public

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start:prod"]
