# sudo docker build . -t divodivenson/photobook-node
# sudo docker ps
# sudo docker stop <container_id>
# sudo docker run -it -p 3001:3001 -d divodivenson/photobook-node
# sudo docker system prune
FROM node:18
RUN apt-get update
RUN apt-get install -y ghostscript
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
EXPOSE 3001
CMD ["pm2-runtime", "bin/www.js", "--name", "photobook-node-app"]
