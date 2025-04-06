# app/dto/artist_dto.py
from pydantic import BaseModel

class ArtistDTO(BaseModel):
    ArtistName: str
    image: str
    genre: str
    country: str
    description: str
