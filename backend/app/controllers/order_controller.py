from fastapi import APIRouter
from app.schemas.order_schema import OrderDTO
from app.models.order import Order
from app.factories.postgres_factory import PostgresFactory

router = APIRouter(prefix="/orders", tags=["Orders"])

order_model = Order(PostgresFactory())

@router.post("/")
def create_order(order: OrderDTO):
    order_model.create_order(order)
    return {"message": "Orden creada correctamente."}

@router.get("/{user_id}")
def get_orders_by_user(user_id: int):
    return order_model.get_orders_by_user(user_id)
