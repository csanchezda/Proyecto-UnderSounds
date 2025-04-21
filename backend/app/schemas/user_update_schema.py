from pydantic import BaseModel, EmailStr
from typing import Optional

class UserUpdateDTO(BaseModel):
    userName: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    nationality: Optional[str] = None
    description: Optional[str] = None
    isArtist: Optional[bool] = None
    profilePicture: Optional[str] = None

