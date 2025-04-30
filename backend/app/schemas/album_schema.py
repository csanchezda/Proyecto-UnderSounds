from pydantic import BaseModel
from typing import Optional

class AlbumDTO(BaseModel):
    idAlbum: int
    idUser: int
    name: str
    description: Optional[str]
    albumThumbnail: Optional[str]
    releaseDate: str
