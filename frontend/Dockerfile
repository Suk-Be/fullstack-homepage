FROM node:20

WORKDIR /app

# Cache-Build nur für package.json + lock
COPY package*.json ./
RUN npm install

# Restliches Projekt
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
