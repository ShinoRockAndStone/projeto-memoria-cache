FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chown -R node:node /app

USER node

EXPOSE 3333

CMD ["npm", "run", "dev"]