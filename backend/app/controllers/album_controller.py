from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from app.models.album import Album
from app.factories.postgres_factory import PostgresFactory
from app.schemas.album_schema import AlbumDTO, AlbumUploadDTO, AlbumUpdateDTO
from typing import List, Optional


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

@router.post("/")
async def create_album_with_songs(
    idUser: int = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    totalDuration: str = Form(...),
    albumThumbnail: UploadFile = File(...),
    wav: Optional[UploadFile] = File(None),  # Opcional
    flac: Optional[UploadFile] = File(None),  # Opcional
    mp3: Optional[UploadFile] = File(None)  # Opcional
):
    try:
        # Procesar el archivo de la imagen
        album_thumbnail_path = f"data/images/albums/{albumThumbnail.filename}"
        with open(album_thumbnail_path, "wb") as f:
            f.write(await albumThumbnail.read())

        # Procesar los formatos de canciones
        song_paths = {"wav": None, "flac": None, "mp3": None}
        if wav:
            wav_path = f"data/audio/albums/mp3/{wav.filename}"
            with open(wav_path, "wb") as f:
                f.write(await wav.read())
            song_paths["wav"] = wav_path
        if flac:
            flac_path = f"data/audio/albums/mp3/{flac.filename}"
            with open(flac_path, "wb") as f:
                f.write(await flac.read())
            song_paths["flac"] = flac_path
        if mp3:
            mp3_path = f"data/audio/albums/mp3/{mp3.filename}"
            with open(mp3_path, "wb") as f:
                f.write(await mp3.read())
            song_paths["mp3"] = mp3_path

        # Crear el álbum
        album_data = AlbumUploadDTO(
            idUser=idUser,
            name=name,
            description=description,
            price=price,
            totalDuration=totalDuration,
            albumThumbnail=album_thumbnail_path,
            wav=song_paths["wav"],
            flac=song_paths["flac"],
            mp3=song_paths["mp3"]
        )
        album_id = album_model.create_album(album_data, [])

        return {"message": "Álbum creado exitosamente", "albumId": album_id}
    except Exception as e:
        print(f"Error inesperado: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    
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