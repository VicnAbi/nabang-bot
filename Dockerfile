# Build Stage
FROM node:16-alpine AS builder

COPY . .

RUN yarn install --production=false
RUN yarn build \
&& rm -rf node_modules

# Runtime Stage
FROM node:16-alpine

ENV APP_HOME=/usr/app
WORKDIR $APP_HOME

COPY --from=builder build build
COPY --from=builder .env .
COPY --from=builder package.json .
COPY --from=builder yarn.lock .

RUN yarn install --production=true
CMD ["yarn", "start"]
