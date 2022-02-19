FROM node:16.14.0-alpine3.15 as builder

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./
RUN npm ci --silent && npm install react-scripts@3.4.1 -g --silent

COPY public ./public
COPY src ./src

RUN npm run build

FROM nginx:1.21.6-alpine as runtime

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
