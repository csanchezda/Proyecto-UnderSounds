from app.factories.dao_factory import DAOFactory
from app.dao.postgres.user_dao_postgres import PostgresUserDAO
from app.dao.postgres.shopping_cart_dao_postgres import PostgresShoppingCartDAO
from app.dao.postgres.order_dao_postgres import PostgresOrderDAO

from app.db.database import db_session

class PostgresFactory(DAOFactory):
    def __init__(self):
        self._session_context = db_session

    def create_user_dao(self):
        return PostgresUserDAO(self._session_context)

    def create_shopping_cart_dao(self):
        return PostgresShoppingCartDAO(self._session_context)


    def create_order_dao(self):
        return PostgresOrderDAO(self._session_context)
