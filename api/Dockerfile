FROM node:19-alpine

WORKDIR /opt/kioskAPI

COPY . .

RUN [ "npm", "i" ]

ENTRYPOINT [ "npm", "run", "start" ]