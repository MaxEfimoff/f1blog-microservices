# Use an existing docker image as a base
FROM node:alpine

WORKDIR '/app'
# Download and install a dependencies
COPY ./package.json /.
RUN npm install
COPY . .

EXPOSE 8083

# Default command
CMD ["npm", "run", "dev"]