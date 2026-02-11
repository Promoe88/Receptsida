FROM node:20-alpine

RUN apk add --no-cache openssl curl

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

ENV PORT=4000
EXPOSE 4000

CMD ["node", "src/index.js"]
