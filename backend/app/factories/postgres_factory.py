from app.factories.dao_factory import DAOFactory
from app.dao.postgres.user_dao_postgres import PostgresUserDAO
from app.db.database import db_session

class PostgresFactory(DAOFactory):
    def __init__(self):
        self._session_context = db_session

    def create_user_dao(self):
        # Devuelve el DAO con el context manager de sesión
        return PostgresUserDAO(self._session_context)
