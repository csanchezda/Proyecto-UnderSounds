from abc import ABC, abstractmethod

class DAOFactory(ABC):

    @abstractmethod
    def create_user_dao(self): pass

    @abstractmethod
    def create_shopping_cart_dao(self): pass

    @abstractmethod
    def create_order_dao(self): pass