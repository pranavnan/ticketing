FROM node:alpine3.18

WORKDIR /app 

COPY package.json .

# RUN npm install
RUN npm install # --omit=dev this --omit=dev is to install the production dependencies not the dev one

COPY . .

CMD ["npm", "run", "dev"]
