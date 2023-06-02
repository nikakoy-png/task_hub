FROM node:14.16.1-alpine3.13

WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install --silent

COPY . /app

RUN yarn build

CMD ["yarn", "start"]
