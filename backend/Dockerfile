FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Construir la aplicación (genera la carpeta dist/)
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/uploads ./uploads  

# Crear carpeta uploads si no existe
# RUN mkdir -p uploads

EXPOSE 3000

CMD [ "node", "dist/main" ]

