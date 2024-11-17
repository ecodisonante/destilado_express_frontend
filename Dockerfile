# Fase 1: Construcción
FROM node:22 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo el código fuente al contenedor
COPY . .

# Construir la aplicación Angular
RUN npm run build --prod

# Fase 2: Servidor Nginx para servir la aplicación Angular
FROM nginx:stable-alpine

# Copiar la aplicación construida desde la fase anterior
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Sobreescribir index.html default de nginx
COPY --from=build /app/dist/frontend/browser/index.csr.html /usr/share/nginx/html/index.html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
