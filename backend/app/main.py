from fastapi import FastAPI
from app.controllers import user_controller, artist_controller, test_connection_db_controller, album_controller
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path



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
app.include_router(test_connection_db_controller.router)
app.include_router(album_controller.router)



@app.get("/")
def root():
    return {"message": "API de UnderSounds funcionando correctamente"}