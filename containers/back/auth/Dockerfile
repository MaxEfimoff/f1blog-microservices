FROM node:alpine
RUN apk add python3 make g++

WORKDIR /app

COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "run", "start"]