FROM node:16

WORKDIR /home/slots
COPY package.json yarn.lock .
RUN yarn
COPY . .
RUN yarn build
CMD yarn serve
