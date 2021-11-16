FROM node:16.12-buster

WORKDIR /app

COPY ./ ./
RUN yarn install  --no-save
RUN yarn build:prod