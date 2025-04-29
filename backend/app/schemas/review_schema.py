from pydantic import BaseModel
from typing import Optional

class ReviewDTO(BaseModel):
    idReview: int
    idProduct: int
    idUser: int
    userName: Optional[str] = None
    profilePicture: Optional[str] = None
    review: str
    rating: float
    date: str

    model_config = {
        "from_attributes": True
    }

class ReviewCreateDTO(BaseModel):
    idProduct: int
    idUser: int
    review: str
    rating: float
    date: Optional[str] = None

class ReviewUpdateDTO(BaseModel):
    idUser: Optional[int] = None
    review: Optional[str] = None
    rating: Optional[float] = None
    date: Optional[str] = None