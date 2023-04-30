# FROM ubuntu:latest

# RUN apt-get update && apt-get install -y nodejs npm
FROM node:18-slim

WORKDIR /usr/src/app

# Copy module dependencies to image
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

# Use port 8000 for socket connection and port 9000 for express.js server
EXPOSE 9000 8000

CMD ["npm", "run", "start:local"] 
