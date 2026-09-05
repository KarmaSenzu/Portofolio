FROM node:20

WORKDIR /app

# Install frontend dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build frontend
RUN echo 'VITE_API_URL=/api' > .env
RUN npm run build

# Install backend dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install

WORKDIR /app

# Backend serves both API and frontend static files on port 3000
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server/index.js"]
