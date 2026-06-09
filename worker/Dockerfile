FROM node:20

ARG DOCKER_GID=1001

RUN apt-get update && \
    apt-get install -y \
    gcc \
    g++ \
    make \
    docker.io && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -g ${DOCKER_GID} dockerhost && \
    usermod -aG dockerhost node

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chown -R node:node /app

USER node

CMD ["node", "src/worker.js"]