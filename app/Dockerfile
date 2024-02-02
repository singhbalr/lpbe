FROM node:12-alpine

WORKDIR /app

COPY . .

# Install Libs and compile
RUN yarn --frozen-lockfile

CMD ["yarn","start" ]