FROM node:alpine
RUN apk add g++ make python

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]