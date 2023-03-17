# docker buildx build --platform linux/amd64 -t divodivenson/photobook-node .
FROM node:18
RUN apt-get update
RUN apt-get install -y ghostscript
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "bin/www.js" ]
