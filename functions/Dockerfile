# Create by: Pham Quy Hai
FROM node:12-alpine AS BUILD_IMAGE

RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
# RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
RUN curl -sfL https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin


WORKDIR /app

COPY package.json yarn.lock ./

# Install Libs and compile
RUN yarn --frozen-lockfile

COPY . .

RUN yarn compile

RUN yarn remove @types/express @types/node @types/ramda @types/uuid dotenv gts nodemon typescript

# run node prune
RUN /usr/local/bin/node-prune

FROM node:12-alpine

WORKDIR /app

COPY --from=BUILD_IMAGE /app/build ./build
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/package.json ./package.json

CMD ["yarn","functions-framework","--source","./build/src/hasura" ]
