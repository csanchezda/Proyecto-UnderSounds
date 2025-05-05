from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from app.models.album import Album
from app.factories.postgres_factory import PostgresFactory
from app.schemas.album_schema import AlbumDTO, AlbumUploadDTO, AlbumUpdateDTO
from typing import List, Optional
import shutil
from pathlib import Path
import traceback


router = APIRouter(prefix="/albums", tags=["Albums"])

album_model = Album(PostgresFactory())

@router.get("/", response_model=list[AlbumDTO])
def get_all_albums():
    return album_model.get_all_albums()

@router.get("/{album_id}", response_model=AlbumDTO)
def get_album_by_id(album_id: int):
    album = album_model.get_album_by_id(album_id)
    if album is None:
        raise HTTPException(status_code=404, detail="Album not found")
    return album

@router.get("/{album_id}/songs")
def get_songs_by_album_id(album_id: int):
    songs = album_model.get_songs_by_album_id(album_id)
    if not songs:
        raise HTTPException(status_code=404, detail="No songs found for this album")
    return songs

@router.post("/", response_model=AlbumDTO)
def create_album(album: AlbumUploadDTO):
    try:
        print(f"Recibiendo canción: {album}")  # Depuración
        created_album = album_model.upload_album(album)
        return created_album
    except Exception as e:
        print("Error al crear el album:")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error al crear el album: {e}")
    
@router.delete("/{album_id}")
def delete_album(album_id: int):
    deleted = album_model.delete_album(album_id)
    if deleted:
        return {"detail": f"Album with id {album_id} deleted successfully."}
    else:
        raise HTTPException(status_code=404, detail="Album not found.")
    
@router.get("/user/{user_id}", response_model=List[AlbumDTO])
def get_albums_by_user_id(user_id: int):
    albums = album_model.get_albums_by_user_id(user_id)
    if not albums:
        raise HTTPException(status_code=404, detail="No albums found for this user")
    return albums
    
@router.put("/{album_id}", response_model=AlbumDTO)
def update_album(album_id: int, album: AlbumUpdateDTO):
    updated = album_model.update_album(album_id, album)
    if updated:
        return updated
    else:
        raise HTTPException(status_code=404, detail="Album not found.")
    
@router.post("/upload/audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        print(f"Recibiendo archivo: {file.filename}")  # Depuración
        print(f"Tipo MIME recibido: {file.content_type}")  # Depuración

        # Define el directorio de subida
        UPLOAD_DIR = Path("audio/albums")
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        # Guarda el archivo original
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Verifica si el archivo se guardó correctamente
        if not file_path.exists():
            print("Error: El archivo no se guardó correctamente.")
            raise HTTPException(status_code=500, detail="Error al guardar el archivo.")

        # Genera las rutas para los tres formatos
        wav_path = str(file_path.with_suffix(".wav")).replace("\\", "/")
        flac_path = str(file_path.with_suffix(".flac")).replace("\\", "/")
        mp3_path = str(file_path.with_suffix(".mp3")).replace("\\", "/")

        print(f"Generando rutas: wav={wav_path}, flac={flac_path}, mp3={mp3_path}")  # Depuración

        # Simula la conversión de formatos (solo copia si las rutas son diferentes)
        if not file_path.name.endswith(".wav"):
            shutil.copy(file_path, wav_path)
        if not file_path.name.endswith(".flac"):
            shutil.copy(file_path, flac_path)
        if not file_path.name.endswith(".mp3"):
            shutil.copy(file_path, mp3_path)

        # Devuelve las rutas generadas
        return {"wav": wav_path, "flac": flac_path, "mp3": mp3_path}
    except Exception as e:
        print(f"Error al subir el archivo de audio: {e}")
        raise HTTPException(status_code=400, detail=f"Error al subir el archivo de audio: {e}")