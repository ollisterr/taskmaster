# build environment
FROM node:16.2.0 as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN npm install
RUN npm install react-scripts@4.0.3 -g

COPY . /app

RUN npm run build

# production environment
FROM nginx:1.17.9-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
