from abc import ABC, abstractmethod
from typing import List
from app.schemas.order_schema import OrderDTO

class OrderDAO(ABC):
    @abstractmethod
    def create_order(self, order: OrderDTO) -> None:
        pass

    @abstractmethod
    def get_orders_by_user(self, user_id: int) -> List[OrderDTO]:
        pass
