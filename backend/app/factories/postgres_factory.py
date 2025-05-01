from app.factories.dao_factory import DAOFactory
from app.dao.postgres.user_dao_postgres import PostgresUserDAO
from app.dao.postgres.product_dao_postgres import PostgresProductDAO
from app.dao.postgres.review_dao_postgres import PostgresReviewDAO
from app.dao.postgres.album_dao_postgres import PostgresAlbumDAO
from app.dao.postgres.song_dao_postgres import PostgresSongDAO
from app.db.database import db_session

class PostgresFactory(DAOFactory):
    def __init__(self):
        self._session_context = db_session

    def create_user_dao(self):
        return PostgresUserDAO(self._session_context)
    
    def create_product_dao(self):
        return PostgresProductDAO(self._session_context)
    
    def create_review_dao(self):
        return PostgresReviewDAO(self._session_context)
    
    def create_album_dao(self):
        return PostgresAlbumDAO(self._session_context)
    def create_song_dao(self):
        return PostgresSongDAO(self._session_context)
