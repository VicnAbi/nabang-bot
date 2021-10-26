# Runtime Stage
FROM node:16-alpine

ENV APP_HOME=/usr/app
WORKDIR $APP_HOME

COPY . .
RUN yarn install --production=false

CMD ["yarn", "start"]
