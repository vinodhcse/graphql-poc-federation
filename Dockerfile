FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk update && apk add git

Run git clone https://github.com/vinodhcse/graphql-poc-federation.git

WORKDIR /usr/src/app/graphql-poc-federation

Run git pull orign master

RUN npm install

CMD [ "node", "categories.js" ]


