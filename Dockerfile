FROM node:latest

WORKDIR /app

COPY . ./

RUN sed -i 's/SERVER_MODE=false/SERVER_MODE=true/g' .env \
    && mkdir ./logs \
    && apt update \
    && apt install -y chromium \
    && npm install

CMD [ "node", "app.js" ]