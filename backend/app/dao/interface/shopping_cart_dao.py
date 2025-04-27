from abc import ABC, abstractmethod
from typing import List
from app.schemas.shopping_cart_schema import ShoppingCartDTO

class ShoppingCartDAO(ABC):
    @abstractmethod
    def get_cart_items(self, user_id: int) -> List[ShoppingCartDTO]:
        pass

    @abstractmethod
    def add_item_to_cart(self, cart_item: ShoppingCartDTO) -> None:
        pass

    @abstractmethod
    def update_item_quantity(self, user_id: int, product_id: int, quantity: int) -> None:
        pass

    @abstractmethod
    def remove_item_from_cart(self, user_id: int, product_id: int) -> None:
        pass

    @abstractmethod
    def clear_cart(self, user_id: int) -> None:
        pass
