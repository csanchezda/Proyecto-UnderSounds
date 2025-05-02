FROM python:3.11-slim-buster

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar requirements si lo tienes
COPY ./requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el contenido del backend
COPY . .

# Exponer el puerto de FastAPI
EXPOSE 8000

# Comando de ejecución
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]