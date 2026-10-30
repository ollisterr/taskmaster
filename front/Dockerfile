# build environment
FROM node:24.22.1 as builder

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci

COPY . /app

RUN npm run build

# production environment
FROM nginx:1.17.9-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
