# Builds production version of Community App inside Docker container,
# and runs it against the specified Topcoder backend (development or
# production) when container is executed.

FROM node:8.2.1
LABEL app="cloudkarafka" version="1.0"

WORKDIR /opt/app
COPY . .
RUN apt-get update
RUN apt-get install -y vim
RUN npm install
CMD ["npm", "start"]
