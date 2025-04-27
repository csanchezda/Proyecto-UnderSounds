from fastapi import APIRouter, HTTPException
from app.schemas.shopping_cart_schema import ShoppingCartDTO
from app.models.shopping_cart import ShoppingCart
from app.factories.postgres_factory import PostgresFactory

router = APIRouter(prefix="/cart", tags=["ShoppingCart"])
cart_model = ShoppingCart(PostgresFactory())

@router.get("/{user_id}", response_model=list[ShoppingCartDTO])
def get_cart(user_id: int):
    return cart_model.get_cart_items(user_id)

@router.post("/", status_code=201)
def add_item(cart_item: ShoppingCartDTO):
    cart_model.add_item_to_cart(cart_item)
    return {"message": "Producto añadido al carrito"}

@router.put("/{user_id}/{product_id}", status_code=200)
def update_quantity(user_id: int, product_id: int, quantity: int):
    cart_model.update_item_quantity(user_id, product_id, quantity)
    return {"message": "Cantidad actualizada"}

@router.delete("/{user_id}/{product_id}", status_code=200)
def remove_item(user_id: int, product_id: int):
    cart_model.remove_item_from_cart(user_id, product_id)
    return {"message": "Producto eliminado"}

@router.delete("/{user_id}", status_code=200)
def clear_cart(user_id: int):
    cart_model.clear_cart(user_id)
    return {"message": "Carrito vaciado"}
