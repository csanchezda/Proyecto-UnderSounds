# Imagen base con Node.js compatible con Angular 19
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package*.json ./

# Instalar dependencias de forma segura
RUN npm ci

# Copiar el resto del proyecto (src, angular.json, tsconfig, etc.)
COPY . .

# Exponer el puerto por defecto de Angular CLI
EXPOSE 4200

# Comando para ejecutar la aplicación con ng serve
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
