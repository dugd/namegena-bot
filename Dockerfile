FROM node:22 AS build

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --include=dev

COPY . .

RUN npm run build

FROM node:22

ARG BUILD_ENV=development

ENV APP_PORT=8000
ENV APP_ENV = development

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci $(test "$BUILD_ENV" = "production" && echo "--production") && npm cache clean --force

COPY --from=build /dist /app/dist

EXPOSE 8000

HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=3 \
    CMD node dist/health-check.js

CMD ["node", "dist/index.js"]
