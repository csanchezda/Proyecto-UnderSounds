from pydantic import BaseModel
from typing import Optional, List
from pydantic import BaseModel, EmailStr

class UserDTO(BaseModel):
    idUser: int
    name: str
    userName: str
    followerNumber: int
    description: str
    email: str
    nationality: str
    isArtist: bool
    profilePicture: Optional[str]

    model_config = {
    "from_attributes": True
    }

class UserRegisterDTO(BaseModel):
    userName: str
    name: str
    email: EmailStr
    password: str
    nationality: str
    description: Optional[str] = "Sin descripción"
    isArtist: Optional[bool] = False
    profilePicture: Optional[str] = None

class UserUpdateDTO(BaseModel):
    userName: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    nationality: Optional[str] = None
    description: Optional[str] = None
    profilePicture: Optional[str] = None

class UserUpdatePasswordDTO(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    
class AlbumDTO(BaseModel):
    idAlbum: int
    idUser: int
    name: str
    albumThumbnail: Optional[str] = None
    artistName: str
    totalDuration: Optional[str] = None

class SongDTO(BaseModel):
    idSong: int
    idUser: int
    name: str
    thumbnail: Optional[str] = None
    artistName: str
    songDuration: Optional[str] = None

class OrderDTO(BaseModel):
    idOrder: int
    idProduct: int
    isSong: bool
    productName: str
    productThumbnail: Optional[str] = None
    artistName: str

class ArtistFilterDTO(BaseModel):
    countries: List[str]
    genres: List[str]