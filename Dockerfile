FROM node:22

ARG BUILD_ENV=development

ENV APP_PORT=8080
ENV APP_ENV = development

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci $(test "$BUILD_ENV" = "production" && echo "--production") && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 8080

HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=3 \
    CMD node dist/health-check.js

CMD ["node", "dist/index.js"]
