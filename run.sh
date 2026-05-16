#!/bin/bash

# 1. Colores para que la consola se vea pro
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Iniciando el despliegue del Challenge...${NC}"

# 2. Levantar el Backend (Java - Spring Boot)
echo -e "${GREEN}Levantando el Backend en el puerto 8080...${NC}"
cd notes-app
# Le damos permisos de ejecución al wrapper de Maven por las dudas
chmod +x mvnw
./mvnw spring-boot:run &

# 3. Esperar un toque a que el backend arranque
sleep 5

# 4. Levantar el Frontend (React - Vite)
echo -e "${GREEN}Instalando dependencias y levantando el Frontend...${NC}"
cd ../frontend
npm install
npm run dev