from fastapi import FastAPI, File, UploadFile
from app.controllers import user_controller, artist_controller, test_connection_db_controller, album_controller,product_controller, review_controller, shopping_cart_controller, payment_controller, order_controller, song_controller
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi
from fastapi.responses import FileResponse
import os, shutil


app = FastAPI(title="UnderSounds API",
    description="API para usuarios, artistas, canciones y más",
    version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:4200",
    "http://localhost:4300"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).resolve().parent.parent / "data"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

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
    base_url = os.getenv("BASE_URL_2", "http://localhost:8000")
    file_url = f"{base_url}/uploaded_images/{file.filename}"
    return {"imageUrl": file_url}

@app.get("/static/{file_path:path}")
async def static_files(file_path: str):
    return FileResponse(
        path=f"static/{file_path}",
        filename=file_path.split("/")[-1],
        media_type='application/octet-stream'
    )

# Routers
app.include_router(user_controller.router)
app.include_router(artist_controller.router)
app.include_router(shopping_cart_controller.router)
app.include_router(product_controller.router)
app.include_router(review_controller.router)
app.include_router(payment_controller.router)
app.include_router(test_connection_db_controller.router)
app.include_router(order_controller.router)
app.include_router(album_controller.router)

bearer_scheme = HTTPBearer()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "Bearer",
            "bearerFormat": "JWT"
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
app.include_router(song_controller.router)


@app.get("/")
def root():
    return {"message": "API de UnderSounds funcionando correctamente"}