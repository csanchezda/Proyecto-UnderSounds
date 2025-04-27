from app.schemas.order_schema import OrderDTO
from app.factories.dao_factory import DAOFactory
from typing import List

class Order:
    def __init__(self, dao_factory: DAOFactory):
        self.dao = dao_factory.create_order_dao()

    def create_order(self, order: OrderDTO):
        self.dao.create_order(order)

    def get_orders_by_user(self, user_id: int) -> List[OrderDTO]:
        return self.dao.get_orders_by_user(user_id)
