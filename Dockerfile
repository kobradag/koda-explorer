FROM node:14

WORKDIR /root/koda-explorer

COPY . .

RUN npm install

ENV NODE_ENV=development

CMD ["npm", "start"]
