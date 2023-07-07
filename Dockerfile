FROM alpine:latest
MAINTAINER MaxDuke <maxduke@gmail.com>

RUN set -ex \
    && apk update \
    && apk upgrade \
    && apk add --no-cache --update nodejs npm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]