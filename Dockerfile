FROM node:18-alpine as dev

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as prod

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=dev /usr/src/app/dist ./dist

CMD [ "node", "dist/app.js" ]

