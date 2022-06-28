ARG NODE_VERSION=10.24.1-alpine3.11

FROM node:${NODE_VERSION} As builder

# Install dependencies for build package C of node
RUN apk update	&& \
  apk --no-cache add make g++ gcc git python && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

##### Building the final image #####
FROM node:${NODE_VERSION}

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["npm", "start"]