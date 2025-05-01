from pydantic import BaseModel, Field
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class AlbumDTO(BaseModel):
    idAlbum: int
    idUser: int
    artistName: Optional[str]
    name: str   
    #songs: List[int] = []
    #genres: List[int] = []
    description: Optional[str] = 'Sin descripcion'
    price: float
    totalDuration: str
    albumThumbnail: str
    albumRelDate: Optional[datetime] = Field(default_factory=datetime.now)
    wav: Optional[str]
    flac: Optional[str]
    mp3: Optional[str]
    totalViews: int

    model_config = {
        "from_attributes": True
    }

class AlbumUploadDTO(BaseModel):
    idUser: int
    name: str
    description: Optional[str] = 'Sin descripcion'
    price: float
    totalDuration: str
    albumThumbnail: str
    albumRelDate: Optional[datetime] = Field(default_factory=datetime.now)
    wav: Optional[str]
    flac: Optional[str]
    mp3: Optional[str]

class AlbumUpdateDTO(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    totalDuration: Optional[str] = None
    albumThumbnail: Optional[str] = None
    wav: Optional[str] = None
    flac: Optional[str] = None
    mp3: Optional[str] = None
