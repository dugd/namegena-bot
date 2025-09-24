FROM node:22

ARG BUILD_ENV=development

ENV APP_PORT=8080
ENV APP_ENV = development

WORKDIR /app

COPY package*.json ./
RUN npm install $(test "$BUILD_ENV" = "production" && echo "--production")

COPY . .

CMD ["node", "bot.js"]
