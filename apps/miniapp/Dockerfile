FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Cache bust: v5
RUN rm -rf dist

ARG VITE_API_URL=https://api-production-35ba.up.railway.app
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
