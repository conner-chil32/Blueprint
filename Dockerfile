FROM ubuntu:22.04

WORKDIR /blueprint

COPY package*.json ./

RUN apt-get update && \
    apt install -y nodejs && \
    apt install -y npm && \
    npm install -y express

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD [ "npm", "start"]