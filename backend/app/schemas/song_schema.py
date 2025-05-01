from pydantic import BaseModel
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class SongDTO (BaseModel):
	idSong: int
	idUser: int
	name: str
	description: Optional[str] = None
	songDuration: Optional[str] = None
	price: float
	songReleaseDate: Optional[datetime] = None
	thumbnail: Optional[str] = None
	wav: Optional[str] = None
	flac: Optional[str] = None
	mp3: Optional[str] = None
	views: int 
	artistName: Optional[str] = None
	genre: Optional[List[str]] = None

class SongUpdateDTO (BaseModel):
	thumbnail: Optional[str] = None
	name: Optional[str] = None
	wav: Optional[str] = None
	flac: Optional[str] = None
	mp3: Optional[str] = None
	genre: Optional[List[str]] = None
	price: Optional[float] = None

class SongUploadDTO (BaseModel):
    idUser: int
    name: str
    description: Optional[str] 
    songDuration: Optional[int] = None
    price: float
    songReleaseDate: Optional[datetime] = None
    thumbnail: str
    wav: str
    flac: str
    mp3: str
    genre: List[str]
    artistName: Optional[str] = None



