FROM node:18-alpine
RUN apk add --no-cache bash
RUN apk add --no-cache curl
ENV NODE_ENV production

WORKDIR usr/src/app
COPY node_modules node_modules/
COPY src src/

CMD ["node", "src/server.js"]

EXPOSE 8080
