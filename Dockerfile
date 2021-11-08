# Build Stage
FROM node:16-alpine

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

RUN yarn install --production=true
CMD ["yarn", "start"]
