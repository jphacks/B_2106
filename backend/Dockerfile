FROM node:16.12-buster

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --no-save

CMD ["node", "serve.js"]