from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegisterDTO(BaseModel):
    userName: str
    email: EmailStr
    password: str
    nationality: str
    description: Optional[str] = "Sin descripción"
    isArtist: Optional[bool] = False
    profilePicture: Optional[str] = None
