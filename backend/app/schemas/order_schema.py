from pydantic import BaseModel

class OrderDTO(BaseModel):
    idUser: int
    idProduct: int

    model_config = {
        "from_attributes": True
    }
