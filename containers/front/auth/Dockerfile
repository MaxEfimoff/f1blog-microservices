# Use an existing docker image as a base
FROM node:alpine

WORKDIR '/app'
# Download and install a dependencies
COPY ./package.json /.
RUN npm install
COPY . .

EXPOSE 8082

# Default command
CMD ["npm", "run", "dev"]