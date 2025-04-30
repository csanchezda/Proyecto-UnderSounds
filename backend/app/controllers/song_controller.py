from fastapi import APIRouter, HTTPException, File, UploadFile
from pathlib import Path
import shutil, traceback
from app.models.song import Song
from app.factories.postgres_factory import PostgresFactory
from app.schemas.song_schema import SongDTO, SongUpdateDTO, SongUploadDTO

router = APIRouter(prefix="/songs", tags=["Songs"])
song_model = Song(PostgresFactory())

@router.get("/", response_model=list[SongDTO])
def get_all_songs():
    return song_model.get_all_songs()

@router.get("/{song_id}", response_model=SongDTO)
def get_song_by_id(song_id: int):
    song = song_model.get_song_by_id(song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Canción no encontrada")
    return song

@router.delete("/{song_id}")
def delete_song(song_id: int):
    deleted = song_model.delete_song(song_id)
    if deleted:
        return {"detail": f"Canción con id {song_id} eliminada correctamente."}
    else:
        raise HTTPException(status_code=404, detail="Canción no encontrada.")


@router.put("/{song_id}", response_model=SongDTO)
def update_song(song_id: int, song: SongUpdateDTO):
    updated = song_model.update_song(song_id, song)
    if updated:
        return updated
    else:
        raise HTTPException(status_code=404, detail="Canción no encontrada.")

@router.post("/", response_model=SongDTO)
def create_song(song: SongUploadDTO):
    try:
        print(f"Recibiendo canción: {song}")  # Depuración
        created_song = song_model.create_song(song)
        return created_song
    except Exception as e:
        print("Error al crear la canción:")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error al crear la canción: {e}")
    
@router.post("/upload/audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        print(f"Recibiendo archivo: {file.filename}")  # Depuración
        print(f"Tipo MIME recibido: {file.content_type}")  # Depuración

        # Define el directorio de subida
        UPLOAD_DIR = Path("audio/songs")
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