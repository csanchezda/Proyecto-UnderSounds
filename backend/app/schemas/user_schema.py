from pydantic import BaseModel
from typing import Optional

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

