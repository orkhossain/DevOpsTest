FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY prisma ./prisma
RUN npm install --production --silent && mv node_modules ../
RUN npm install -g ts-node
RUN npx prisma generate
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["npm","run","dev"]