from app.factories.dao_factory import DAOFactory
from app.dao.postgres.user_dao_postgres import PostgresUserDAO

class PostgresFactory(DAOFactory):
    def create_user_dao(self):
        return PostgresUserDAO()
