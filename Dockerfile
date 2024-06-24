FROM node:18-alpine

ENV PORT=80
ENV HOST=0.0.0.0
ENV NODE_ENV=production

#create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#install app dependencies
COPY package*.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

#bundle app source
COPY . /usr/src/app

RUN npm build
EXPOSE 80

CMD ["npm", "start"]
