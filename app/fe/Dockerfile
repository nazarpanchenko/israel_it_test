# FROM ubuntu:latest

# RUN apt-get update && apt-get install -y nodejs npm
FROM node:18-slim

WORKDIR /usr/src/app

# Copy module dependencies to image
COPY ./package.json ./
COPY ./yarn.lock ./

RUN npm install

COPY . .

# Run client application on the port 3000
EXPOSE 3000

CMD ["npm", "run", "start"]
