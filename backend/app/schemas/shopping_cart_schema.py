from pydantic import BaseModel

class ShoppingCartDTO(BaseModel):
    idUser: int
    idProduct: int
    quantity: int

    model_config = {
        "from_attributes": True
    }
