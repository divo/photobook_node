# sudo docker build . -t divodivenson/photobook-node
# docker buildx build --platform linux/amd64 -t divodivenson/photobook-node .
# sudo docker run -it -p 3001:3001 -d divodivenson/photobook-node
FROM node:18
RUN apt-get update
RUN apt-get install -y ghostscript
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
EXPOSE 3001
CMD ["pm2", "start", "bin/www.js", "--name", "photobook-node-app"]
CMD ["/bin/bash"]
