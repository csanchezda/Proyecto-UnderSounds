from sqlalchemy import text
from app.dao.interface.user_dao import UserDAO
from app.schemas.user_schema import UserDTO
from app.db.database import db_session

class PostgresUserDAO(UserDAO):
    def get_all_artists(self):
        with db_session() as session:
            result = session.execute(text(
                'SELECT * FROM "User" WHERE "isArtist" = TRUE'
            )).mappings()
            return [UserDTO(**row) for row in result.fetchall()]

    def get_all_users(self):
        with db_session() as session:
            result = session.execute(text('SELECT * FROM "User"')).mappings()
            return [UserDTO(**row) for row in result.fetchall()]

    def get_user_by_id(self, user_id: int):
        with db_session() as session:
            result = session.execute(
                text('SELECT * FROM "User" WHERE "idUser" = :id'),
                {"id": user_id}
            ).mappings().fetchone()

            return UserDTO(**result) if result else None
