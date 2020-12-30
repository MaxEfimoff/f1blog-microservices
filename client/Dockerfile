FROM node:alpine

WORKDIR /app
COPY container/package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]