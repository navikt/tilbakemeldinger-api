FROM node:14-alpine
RUN apk add --no-cache bash
RUN apk add --no-cache curl
ENV NODE_ENV production

WORKDIR usr/src/app
COPY . .
RUN npm install

CMD ["node", "src/server.js"]

EXPOSE 8080
