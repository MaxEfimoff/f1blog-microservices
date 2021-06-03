FROM node:alpine
RUN apk add python2 make g++

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

# RUN npm run migrate up

CMD ["npm", "start"]