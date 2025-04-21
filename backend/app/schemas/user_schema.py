from pydantic import BaseModel
from typing import Optional
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
    isArtist: Optional[bool] = None
    profilePicture: Optional[str] = None

