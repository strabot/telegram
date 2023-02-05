FROM node:18.13.0-alpine

ENV STRABOT_MANAGER_URL=http://manager:1337/api
ENV STRABOT_MANAGER_TOKEN=

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD [ "npm", "start" ]
