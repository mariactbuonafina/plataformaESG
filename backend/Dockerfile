FROM node:20

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; then npm install --omit=dev; else npm install; fi

COPY . .

EXPOSE 3333

ENV NODE_ENV=$NODE_ENV

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm start; else npm run dev; fi"]