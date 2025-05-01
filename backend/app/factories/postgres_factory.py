from app.factories.dao_factory import DAOFactory
from app.dao.postgres.user_dao_postgres import PostgresUserDAO
from app.dao.postgres.album_dao_postgres import PostgresAlbumDAO
from app.db.database import db_session

class PostgresFactory(DAOFactory):
    def __init__(self):
        self._session_context = db_session

    def create_user_dao(self):
        return PostgresUserDAO(self._session_context)
    
    def create_album_dao(self):
        return PostgresAlbumDAO(self._session_context)
