FROM node:16-alpine

WORKDIR /usr/src/app

Run git clone https://github.com/vinodhcse/graphql-poc-federation.git

RUN cd graphql-poc-federation

RUN npm install

CMD [ "node", "categories.js" ]


