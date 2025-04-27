from app.schemas.shopping_cart_schema import ShoppingCartDTO
from app.factories.dao_factory import DAOFactory

class ShoppingCart:
    def __init__(self, dao_factory: DAOFactory):
        self.dao = dao_factory.create_shopping_cart_dao()

    def get_cart_items(self, user_id: int):
        return self.dao.get_cart_items(user_id)

    def add_item_to_cart(self, cart_item: ShoppingCartDTO):
        self.dao.add_item_to_cart(cart_item)

    def update_item_quantity(self, user_id: int, product_id: int, quantity: int):
        self.dao.update_item_quantity(user_id, product_id, quantity)

    def remove_item_from_cart(self, user_id: int, product_id: int):
        self.dao.remove_item_from_cart(user_id, product_id)

    def clear_cart(self, user_id: int):
        self.dao.clear_cart(user_id)
