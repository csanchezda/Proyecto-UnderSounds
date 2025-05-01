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
                if usuario["profilePicture"] and not usuario["profilePicture"].startswith("http"):
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
            if usuario["profilePicture"] and not usuario["profilePicture"].startswith("http"):
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

    def get_user_by_email(self, email: str) -> Optional[UserDTO]:
        with self.session_context() as session:
            result = session.execute(
                text('SELECT * FROM "User" WHERE "email" = :email'),
                {"email": email}
            ).mappings().fetchone()

            if result:
                user_data = dict(result)
                if user_data["profilePicture"] and not user_data["profilePicture"].startswith("http"):
                    user_data["profilePicture"] = "http://localhost:8000/static/" + user_data["profilePicture"]

                return UserDTO(**user_data)

            return None

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

    def update_password(self, email: str, new_password: str) -> bool:
        with self.session_context() as session:
            # Verificar si existe el usuario
            result = session.execute(
                text('SELECT * FROM "User" WHERE "email" = :email'),
                {"email": email}
            ).fetchone()

            if not result:
                return False  # No existe el usuario con ese email

            # Actualizar la contraseña
            session.execute(
                text('UPDATE "User" SET "password" = :new_password WHERE "email" = :email'),
                {"email": email, "new_password": new_password}
            )
            session.commit()
            return True

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
                JOIN "Songs" s ON f."idSong" = s."idSong"
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

    def get_followed_artists(self, user_id: int) -> List[UserDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT u.*
                FROM "Follower" f
                JOIN "User" u ON f."idFollowed" = u."idUser"
                WHERE f."idFollower" = :user_id
                AND u."isArtist" = TRUE
            """), {"user_id": user_id}).mappings().fetchall()

            artistas = [dict(row) for row in result]

            for artista in artistas:
                if artista["profilePicture"]:
                    artista["profilePicture"] = BASE_URL + artista["profilePicture"]

            return [UserDTO(**artista) for artista in artistas]

    def get_artists_ordered_by_name(self) -> List[UserDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT * FROM "User"
                WHERE "isArtist" = TRUE
                ORDER BY "name" ASC
            """)).mappings()

            artistas = [dict(row) for row in result.fetchall()]
            for artista in artistas:
                if artista["profilePicture"]:
                    artista["profilePicture"] = BASE_URL + artista["profilePicture"]

            return [UserDTO(**artista) for artista in artistas]

    def get_artists_ordered_by_followers(self) -> List[UserDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT u.*, COUNT(f."idFollower") AS "followersCount"
                FROM "User" u
                LEFT JOIN "Follower" f ON u."idUser" = f."idFollowed"
                WHERE u."isArtist" = TRUE
                GROUP BY u."idUser"
                ORDER BY "followersCount" DESC
            """)).mappings()

            artistas = [dict(row) for row in result.fetchall()]
            for artista in artistas:
                if artista["profilePicture"]:
                    artista["profilePicture"] = BASE_URL + artista["profilePicture"]

            return [UserDTO(**artista) for artista in artistas]

    def get_artists_ordered_by_song_views(self) -> List[UserDTO]:
        with self.session_context() as session:
            result = session.execute(text("""
                SELECT u.*, COALESCE(SUM(s."views"), 0) AS "totalViews"
                FROM "User" u
                LEFT JOIN "Songs" s ON u."idUser" = s."idUser"
                WHERE u."isArtist" = TRUE
                GROUP BY u."idUser"
                ORDER BY "totalViews" DESC
            """)).mappings()

            artistas = [dict(row) for row in result.fetchall()]
            for artista in artistas:
                if artista["profilePicture"]:
                    artista["profilePicture"] = BASE_URL + artista["profilePicture"]

            return [UserDTO(**artista) for artista in artistas]

    def get_artists_by_country_and_genre(self, countries: List[str], genres: List[str]) -> List[UserDTO]:
        with self.session_context() as session:
            if not countries and not genres:
                return []

            base_query = """
                SELECT DISTINCT u.*
                FROM "User" u
                JOIN "Songs" s ON u."idUser" = s."idUser"
                JOIN "GenreSongRelation" gsr ON s."idSong" = gsr."idSong"
                JOIN "Genre" g ON gsr."idGenre" = g."idGenre"
                WHERE u."isArtist" = TRUE
            """

            params = {}

            if countries:
                base_query += ' AND u."nationality" IN :countries'
                params["countries"] = countries

            if genres:
                base_query += ' AND g."genreName" IN :genres'
                params["genres"] = genres

            stmt = text(base_query)

            if "countries" in params:
                stmt = stmt.bindparams(bindparam("countries", expanding=True))
            if "genres" in params:
                stmt = stmt.bindparams(bindparam("genres", expanding=True))

            result = session.execute(stmt, params).mappings()
            artistas = [dict(row) for row in result.fetchall()]

            for artista in artistas:
                if artista["profilePicture"]:
                    artista["profilePicture"] = BASE_URL + artista["profilePicture"]

            return [UserDTO(**artista) for artista in artistas]

    def search_artists_by_name(self, name: str) -> List[UserDTO]:
        with self.session_context() as session:
            stmt = text("""
                SELECT * FROM "User"
                WHERE "isArtist" = TRUE
                AND LOWER("name") LIKE :name
            """)
            # Búsqueda que empiece por las letras dadas, ignorando mayúsculas/minúsculas
            result = session.execute(stmt, {"name": f"{name.lower()}%"}).mappings()

            artistas = [dict(row) for row in result.fetchall()]
            for artista in artistas:
                if artista["profilePicture"]:
                    artista["profilePicture"] = BASE_URL + artista["profilePicture"]
            return [UserDTO(**artista) for artista in artistas]

    def get_filtered_artists(self, name: Optional[str], order: Optional[str]) -> List[UserDTO]:
        with self.session_context() as session:
            base_query = """
                SELECT u.*, 
                    COALESCE(SUM(s."views"), 0) AS "totalViews",
                    COUNT(f."idFollower") AS "followersCount"
                FROM "User" u
                LEFT JOIN "Songs" s ON u."idUser" = s."idUser"
                LEFT JOIN "Follower" f ON u."idUser" = f."idFollowed"
                WHERE u."isArtist" = TRUE
            """

            params = {}

            # Filtro por nombre que empieza por...
            if name:
                base_query += ' AND LOWER(u."name") LIKE :name'
                params["name"] = f"{name.lower()}%"

            base_query += ' GROUP BY u."idUser"'

            if order == "views":
                base_query += ' ORDER BY "totalViews" DESC'
            elif order == "followers":
                base_query += ' ORDER BY "followersCount" DESC'
            elif order == "name":
                base_query += ' ORDER BY u."name" ASC'

            stmt = text(base_query)
            if "name" in params:
                stmt = stmt.bindparams(bindparam("name"))

            result = session.execute(stmt, params).mappings()
            artistas = [dict(row) for row in result.fetchall()]

            for artista in artistas:
                if artista["profilePicture"]:
                    artista["profilePicture"] = BASE_URL + artista["profilePicture"]

            return [UserDTO(**artista) for artista in artistas]
