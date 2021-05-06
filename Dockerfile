#local node version for compatibility
FROM node:15.5.1

#declare development env for performance
ENV NODE_ENV=production

#default workdir
WORKDIR /app

#copy package/package-lock for dep
COPY package*.json ./

#install dep
RUN npm install --production

#copies src
COPY . .

EXPOSE 5000
#run server
CMD [ "node", "index.js" ]