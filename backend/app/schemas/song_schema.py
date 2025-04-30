from pydantic import BaseModel
from typing import Optional

class SongDTO(BaseModel):
    idSong: int
    idUser: int
    name: str
    description: str
    songDuration: Optional[str]
    price: float
    songReleaseDate: str
    thumbnail: Optional[str]
    views: int
