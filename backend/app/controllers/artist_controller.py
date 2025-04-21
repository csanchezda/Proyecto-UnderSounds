from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory
from app.schemas.user_schema import UserDTO

router = APIRouter(prefix="/artists", tags=["Artists"])
artist_model = User(PostgresFactory())

@router.get("/", response_model=List[UserDTO])
def get_all_artists(nationalities: Optional[List[str]] = Query(default=None)):
    return artist_model.get_all_artists(nationalities=nationalities)

@router.get("/{artist_id}", response_model=UserDTO)
def get_artist_by_id(artist_id: int):
    artist = artist_model.get_user_by_id(artist_id)
    if not artist or not artist.isArtist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    return artist
