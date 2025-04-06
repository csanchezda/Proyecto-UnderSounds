# app/controller/artist_controller.py
from fastapi import APIRouter, HTTPException
from app.dao.artist_dao import ArtistDAO
from app.dto.artist_dto import ArtistDTO
from app.factory.artist_factory import ArtistFactory

router = APIRouter()
artist_dao = ArtistDAO()

@router.get("/artists")
def get_all_artists():
    return artist_dao.get_all_artists()

@router.post("/artists")
def create_artist(dto: ArtistDTO):
    artist = ArtistFactory.from_dto(dto)
    artist_dao.save_artist(artist)
    return {"message": "Artist created", "id": artist.id}
