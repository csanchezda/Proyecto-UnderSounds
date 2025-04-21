from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserDTO
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory

router = APIRouter(prefix="/artists", tags=["Artists"])
artist_model = User(PostgresFactory())

@router.get("/", response_model=list[UserDTO])
def get_all_artists():
    return artist_model.get_all_artists()

@router.get("/{artist_id}", response_model=UserDTO)
def get_artist_by_id(artist_id: int):
    artist = artist_model.get_user_by_id(artist_id)
    if not artist or not artist.isArtist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    return artist
