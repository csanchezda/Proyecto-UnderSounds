from sqlalchemy import text
from sqlalchemy import text, bindparam
from typing import Optional, List
from app.dao.interface.user_dao import UserDAO
from app.schemas.user_schema import UserDTO, UserRegisterDTO, UserUpdateDTO, AlbumDTO, SongDTO, OrderDTO


BASE_URL = "http://localhost:8000/static/"

class PostgresUserDAO(UserDAO):
    def __init__(self, session_context):
        self.session_context = session_context

    def get_all_artists(self, nationalities: Optional[List[str]] = None):
        with self.session_context() as session:
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
        with self.session_context() as session:
            result = session.execute(text('SELECT * FROM "User"')).mappings()

            usuarios = [dict(row) for row in result.fetchall()]

            for usuario in usuarios:
                if usuario["profilePicture"]:
                    usuario["profilePicture"] = BASE_URL + usuario["profilePicture"]

            return [UserDTO(**usuario) for usuario in usuarios]

    def get_user_by_id(self, user_id: int):
        with self.session_context() as session:
            result = session.execute(
                text('SELECT * FROM "User" WHERE "idUser" = :id'),
                {"id": user_id}
            ).mappings().fetchone()

            if result:
                usuario = dict(result)
                if usuario["profilePicture"]:
                    usuario["profilePicture"] = BASE_URL + usuario["profilePicture"]
                return UserDTO(**usuario)

            return None
    
    def register_user(self, user: UserRegisterDTO) -> UserDTO:
        with self.session_context() as session:
            # Validar duplicados
            result = session.execute(
                text('SELECT * FROM "User" WHERE "userName" = :uname OR "email" = :email'),
                {"uname": user.userName, "email": user.email}
            ).fetchone()

            if result:
                raise Exception("El nombre de usuario o correo ya están en uso.")

            user_dict = user.dict()
            if not user_dict["profilePicture"]:
                user_dict["profilePicture"] = "images/profile/default.jpg"

            # Insertar usuario
            session.execute(text("""
                INSERT INTO "User" 
                ("userName", "name","email", "password", "nationality", "description", "isArtist", "profilePicture")
                VALUES (:userName, :name, :email, :password, :nationality, :description, :isArtist, :profilePicture)
            """), user_dict)

            session.commit()

            # Devolver usuario creado
            result = session.execute(
                text('SELECT * FROM "User" WHERE "userName" = :uname'),
                {"uname": user.userName}
            ).mappings().fetchone()

            usuario = dict(result)
            if usuario["profilePicture"]:
                usuario["profilePicture"] = BASE_URL + usuario["profilePicture"]

            return UserDTO(**usuario)

    
    def delete_user(self, user_id: int) -> bool:
        with self.session_context() as session:
            # Verificar si existe
            result = session.execute(
                text('SELECT * FROM "User" WHERE "idUser" = :id'),
                {"id": user_id}
            ).fetchone()

            if not result:
                return False

            session.execute(
                text('DELETE FROM "User" WHERE "idUser" = :id'),
                {"id": user_id}
            )
            session.commit()
            return True

    def update_user(self, user_id: int, user: UserUpdateDTO) -> Optional[UserDTO]:
        with self.session_context() as session:
            # Comprobar si existe
            result = session.execute(
                text('SELECT * FROM "User" WHERE "idUser" = :id'),
                {"id": user_id}
            ).mappings().fetchone()

            if not result:
                return None

            fields = []
            params = {"id": user_id}

            for field, value in user.dict(exclude_unset=True).items():
                fields.append(f'"{field}" = :{field}')
                params[field] = value

            if fields:
                query = f'UPDATE "User" SET {", ".join(fields)} WHERE "idUser" = :id'
                session.execute(text(query), params)
                session.commit()

            # Obtener el usuario actualizado
            result = session.execute(
                text('SELECT * FROM "User" WHERE "idUser" = :id'),
                {"id": user_id}
            ).mappings().fetchone()

            usuario = dict(result)
            if usuario["profilePicture"]:
                usuario["profilePicture"] = usuario["profilePicture"]

        return UserDTO(**usuario)

    def login_user(self, email: str, password: str) -> Optional[UserDTO]:
        with self.session_context() as session:
            result = session.execute(
                text('SELECT * FROM "User" WHERE "email" = :email AND "password" = :password'),
                {"email": email, "password": password}
            ).mappings().fetchone()

            if result:
                usuario = dict(result)
                if usuario["profilePicture"]:
                    usuario["profilePicture"] = BASE_URL + usuario["profilePicture"]
                return UserDTO(**usuario)

            return None

    def get_followers(self, followed_id: int) -> List[UserDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT u.*
                FROM "Follower" f
                JOIN "User" u ON f."idFollower" = u."idUser"
                WHERE f."idFollowed" = :fid
            """), {"fid": followed_id}).mappings()

            seguidores = [dict(row) for row in result.fetchall()]

            for seguidor in seguidores:
                if seguidor["profilePicture"]:
                    seguidor["profilePicture"] = BASE_URL + seguidor["profilePicture"]

            return [UserDTO(**seguidor) for seguidor in seguidores]

    def get_followings(self, follower_id: int) -> List[UserDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT u.*
                FROM "Follower" f
                JOIN "User" u ON f."idFollowed" = u."idUser"
                WHERE f."idFollower" = :fid
            """), {"fid": follower_id}).mappings()

            seguidos = [dict(row) for row in result.fetchall()]

            for seguido in seguidos:
                if seguido["profilePicture"]:
                    seguido["profilePicture"] = BASE_URL + seguido["profilePicture"]

            return [UserDTO(**seguido) for seguido in seguidos]

    def get_favorite_albums(self, user_id: int) -> List[AlbumDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT a.*, u."name" AS "artistName"
                FROM "FavAlbums" f
                JOIN "Album" a ON f."idAlbum" = a."idAlbum"
                JOIN "User" u ON a."idUser" = u."idUser"
                WHERE f."idUser" = :fid
            """), {"fid": user_id}).mappings()

            albumes = [dict(row) for row in result.fetchall()]

            for album in albumes:
                if album["albumThumbnail"]:
                    album["albumThumbnail"] = BASE_URL + album["albumThumbnail"]

            return [AlbumDTO(**album) for album in albumes]

    def get_favorite_songs(self, user_id: int) -> List[SongDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT s.*, u."name" AS "artistName"
                FROM "FavSongs" f
                JOIN "Song" s ON f."idSong" = s."idSong"
                JOIN "User" u ON s."idUser" = u."idUser"
                WHERE f."idUser" = :fid
            """), {"fid": user_id}).mappings()

            canciones = [dict(row) for row in result.fetchall()]

            for cancion in canciones:
                if cancion["thumbnail"]:
                    cancion["thumbnail"] = BASE_URL + cancion["thumbnail"]

            return [SongDTO(**cancion) for cancion in canciones]

    def get_orders(self, user_id: int) -> List[OrderDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT 
                    o."idOrder",
                    p."isSong",
                    CASE 
                        WHEN p."isSong" THEN s."idSong"
                        ELSE a."idAlbum"
                    END AS "idProduct",
                    CASE 
                        WHEN p."isSong" THEN s."name"
                        ELSE a."name"
                    END AS "productName",
                    CASE 
                        WHEN p."isSong" THEN s."thumbnail"
                        ELSE a."albumThumbnail"
                    END AS "productThumbnail",
                    CASE 
                        WHEN p."isSong" THEN u."name"
                        ELSE u."name"
                    END AS "artistName"
                FROM "Orders" o
                LEFT JOIN "Product" p ON o."idProduct" = p."idProduct"
                LEFT JOIN "Songs" s ON p."idSong" = s."idSong" AND p."isSong" = TRUE
                LEFT JOIN "Album" a ON p."idAlbum" = a."idAlbum" AND p."isSong" = FALSE
                JOIN "User" u ON (s."idUser" = u."idUser" AND p."isSong" = TRUE) OR (a."idUser" = u."idUser" AND p."isSong" = FALSE)
                WHERE o."idUser" = :uid
            """), {"uid": user_id}).mappings()

            orders = [dict(row) for row in result.fetchall()]
            return orders
