FROM node:16-alpine3.14

WORKDIR /client-mqtt-app

COPY package.json .

RUN npm i

COPY certs/ certs/
COPY src/ src/


CMD [ "node", "src/index.js" ]
