
from fastapi import FastAPI, File, UploadFile
from app.controllers import user_controller, artist_controller, test_connection_db_controller
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os, shutil

from fastapi import FastAPI
from app.controllers import user_controller, artist_controller, product_controller, review_controller, test_connection_db_controller
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.responses import FileResponse


app = FastAPI(title="UnderSounds API",
    description="API para usuarios, artistas, canciones y más",
    version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).resolve().parent.parent / "data"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Routers
app.include_router(user_controller.router)
app.include_router(artist_controller.router)
app.include_router(product_controller.router)
app.include_router(review_controller.router)
app.include_router(test_connection_db_controller.router)


@app.get("/")
def root():
    return {"message": "API de UnderSounds funcionando correctamente"}


# Carpeta donde se guardarán las imágenes subidas
UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Configura la carpeta para servir archivos estáticos
app.mount("/uploaded_images", StaticFiles(directory=UPLOAD_DIR), name="uploaded_images")

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Endpoint para subir una imagen y devolver su URL pública.
    """
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Devuelve la URL pública del archivo
    file_url = f"http://localhost:8000/uploaded_images/{file.filename}"
    return {"imageUrl": file_url}

@app.get("/static/{file_path:path}")
async def static_files(file_path: str):
    return FileResponse(
        path=f"static/{file_path}",
        filename=file_path.split("/")[-1],
        media_type='application/octet-stream'
    )

