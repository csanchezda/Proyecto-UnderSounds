from fastapi import APIRouter
from app.dto.artist_dto import ArtistDTO

router = APIRouter()

@router.get("/artists")
async def get_artists():
    artists = ArtistDTO.get_all_artists()
    return artists
