FROM node:alpine
RUN apk add python2 make g++

WORKDIR /app

COPY package.json .
RUN npm install --only=prod
COPY . .

# COPY docker-entrypoint.sh /app/
# RUN chmod 777 /app/docker-entrypoint.sh && \
#   ln -s app/docker-entrypoint.sh / # backwards compat

# ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "run", "start"]