from pydantic import BaseModel
from typing import Optional

class ProductDTO(BaseModel):
    idProduct: int
    isSong: bool
    title: str
    artistName: Optional[str]
    description: str
    price: float
    date: str
    image: Optional[str]
    idAlbum: Optional[int] = None
    wav: Optional[str] = None
    flac: Optional[str] = None
    mp3: Optional[str] = None
    averageRating: Optional[float] = None

    model_config = {
        "from_attributes": True
    }

class ProductCreateDTO(BaseModel):
    isSong: bool
    idSong: Optional[int] = None
    idAlbum: Optional[int] = None

class ProductUpdateDTO(BaseModel):
    isSong: Optional[bool] = None
    idSong: Optional[int] = None
    idAlbum: Optional[int] = None
