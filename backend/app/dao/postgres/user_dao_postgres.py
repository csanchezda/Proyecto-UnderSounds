from sqlalchemy import text
from sqlalchemy import text, bindparam
from typing import Optional, List
from app.dao.interface.user_dao import UserDAO
from app.schemas.user_schema import UserDTO
from app.db.database import db_session
from app.schemas.user_register_schema import UserRegisterDTO

BASE_URL = "http://localhost:8000/static/"

class PostgresUserDAO(UserDAO):
    def get_all_artists(self, nationalities: Optional[List[str]] = None):
        with db_session() as session:
            base_query = 'SELECT * FROM "User" WHERE "isArtist" = TRUE'

            if nationalities:
                base_query += ' AND "nationality" IN :nats'
                stmt = text(base_query).bindparams(bindparam("nats", expanding=True))
                result = session.execute(stmt, {"nats": nationalities}).mappings()
            else:
                result = session.execute(text(base_query)).mappings()

            artistas = [dict(row) for row in result.fetchall()]

            for artista in artistas:
                if artista["profilePicture"]:
                    artista["profilePicture"] = BASE_URL + artista["profilePicture"]

            return [UserDTO(**artista) for artista in artistas]

    def get_all_users(self):
        with db_session() as session:
            result = session.execute(text('SELECT * FROM "User"')).mappings()

            usuarios = [dict(row) for row in result.fetchall()]

            for usuario in usuarios:
                if usuario["profilePicture"]:
                    usuario["profilePicture"] = BASE_URL + usuario["profilePicture"]

            return [UserDTO(**usuario) for usuario in usuarios]

    def get_user_by_id(self, user_id: int):
        with db_session() as session:
            result = session.execute(
                text('SELECT * FROM "User" WHERE "idUser" = :id'),
                {"id": user_id}
            ).mappings().fetchone()

            if result:
                usuario = dict(result)  # ✅ convertir a diccionario
                if usuario["profilePicture"]:
                    usuario["profilePicture"] = BASE_URL + usuario["profilePicture"]
                return UserDTO(**usuario)

            return None
    
    def register_user(self, user: UserRegisterDTO) -> UserDTO:
        with db_session() as session:
            result = session.execute(
                text('SELECT * FROM "User" WHERE "userName" = :uname OR "email" = :email'),
                {"uname": user.userName, "email": user.email}
            ).fetchone()

            if result:
                raise Exception("Nombre de usuario o correo ya existen.")

            # Insertar nuevo usuario
            session.execute(text("""
                INSERT INTO "User" 
                ("userName", "email", "password", "nationality", "description", "isArtist", "profilePicture")
                VALUES (:userName, :email, :password, :nationality, :description, :isArtist, :profilePicture)
            """), user.dict())

            session.commit()

            # Recuperar y devolver usuario creado
            result = session.execute(text(
                'SELECT * FROM "User" WHERE "userName" = :uname'
            ), {"uname": user.userName}).mappings().fetchone()

            usuario = dict(result)
            if usuario["profilePicture"]:
                usuario["profilePicture"] = BASE_URL + usuario["profilePicture"]

            return UserDTO(**usuario)
