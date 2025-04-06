from fastapi import FastAPI
from app.controller.artist_controller import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Incluye el enrutador en la aplicación principal
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Permite solicitudes desde el frontend de Angular
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los encabezados
)