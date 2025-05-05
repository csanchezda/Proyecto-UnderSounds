from sqlalchemy import text
from sqlalchemy import text, bindparam
from typing import Optional, List, Dict
from app.dao.interface.album_dao import AlbumDAO
from app.schemas.album_schema import AlbumDTO, AlbumUploadDTO, AlbumUpdateDTO

import os
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000/static/")

class PostgresAlbumDAO(AlbumDAO):
    def __init__(self, session_context):
        self.session_context = session_context

    def get_all_albums(self):
        with self.session_context() as session:
            # Modifica la consulta para incluir el JOIN con la tabla User
            result = session.execute(
                text('''
                    SELECT al.*, u."userName"
                    FROM "Album" al
                    LEFT JOIN "User" u ON al."idUser" = u."idUser"
                ''')
            ).mappings()

            # Convierte los resultados en una lista de diccionarios
            albums = [dict(row) for row in result.fetchall()]

            # Agrega la URL base al campo albumThumbnail si existe
            for album in albums:
                if album["albumThumbnail"]:
                    album["albumThumbnail"] = BASE_URL + album["albumThumbnail"]
                album["artistName"] = album.pop("userName", None)  # Renombrar el campo userName

            # Devuelve los resultados como una lista de AlbumDTO
            return [AlbumDTO(**album) for album in albums]

    def get_album_by_id(self, album_id: int):
        with self.session_context() as session:
            result = session.execute(
                text('''
                    SELECT al.*, u."userName" AS "artistName"
                    FROM "Album" al
                    LEFT JOIN "User" u ON al."idUser" = u."idUser"
                    WHERE al."idAlbum" = :id
                '''),
            {"id": album_id}
        ).mappings().fetchone()

        if result:
            album = dict(result)
            if album["albumThumbnail"]:
                album["albumThumbnail"] = BASE_URL + album["albumThumbnail"]
            return AlbumDTO(**album)

        return None
    
    def get_songs_by_album_id(self, album_id: int):
        with self.session_context() as session:
            result = session.execute(
                text('''
                    SELECT s."idSong", s."name", s."songDuration", s."thumbnail"
                    FROM "Songs" s
                    JOIN "AlbumSongRelation" asg ON s."idSong" = asg."idSong"
                    WHERE asg."idAlbum" = :album_id
                '''),
                {"album_id": album_id}
            ).mappings().fetchall()

            return [dict(row) for row in result]
        
    def upload_album(self, album: AlbumUploadDTO):
        album_dict = album.dict()

        # Normaliza las rutas de los archivos
        if album_dict.get("wav"):
            album_dict["wav"] = album_dict["wav"].replace("\\", "/")
        if album_dict.get("flac"):
            album_dict["flac"] = album_dict["flac"].replace("\\", "/")
        if album_dict.get("mp3"):
            album_dict["mp3"] = album_dict["mp3"].replace("\\", "/")

        if album_dict.get("albumThumbnail"):
            if album_dict["albumThumbnail"].startswith("data:image"):
                album_dict["albumThumbnail"] = album_dict["albumThumbnail"].split(",")[1]
        

        album_dict["totalDuration"] = album_dict.pop("totalDuration")  
        album_dict["albumRelDate"] = album_dict.pop("albumRelDate")

        query = """
        INSERT INTO "Album" ("idUser", name, description, "totalDuration", price, "albumRelDate", "albumThumbnail", wav, flac, mp3)
        VALUES (:idUser, :name, :description, :totalDuration, :price, :albumRelDate, :albumThumbnail, :wav, :flac, :mp3)
        RETURNING *;
        """
        with self.session_context() as session:
            result = session.execute(text(query), album_dict).mappings().fetchone()
            session.commit()

        return AlbumDTO(**result)
        
    def create_album(self, album_data: AlbumUploadDTO, songs: List[Dict]) -> int:
        with self.session_context() as session:
            album_stmt = text('''
                INSERT INTO "Album" ("idUser", "name", "description", "price", "totalDuration", "albumThumbnail", "albumRelDate", "wav", "flac", "mp3")
                VALUES (:idUser, :name, :description, :price, :totalDuration, :albumThumbnail, :albumRelDate, :wav, :flac, :mp3)
                RETURNING "idAlbum"
            ''')
            album_result = session.execute(album_stmt, album_data.dict())
            album_id = album_result.fetchone()[0]
            session.commit()
            return album_id
        
    def delete_album(self, album_id: int) -> bool:
        with self.session_context() as session:
            result = session.execute(
                text('DELETE FROM "Album" WHERE "idAlbum" = :id'),
                {"id": album_id}
            )
            return result.rowcount > 0
        
    def get_albums_by_user_id(self, user_id: int):
        with self.session_context() as session:
            result = session.execute(
                text('''
                    SELECT al.*, u."userName" AS "artistName"
                    FROM "Album" al
                    LEFT JOIN "User" u ON al."idUser" = u."idUser"
                    WHERE al."idUser" = :user_id
                '''),
                {"user_id": user_id}
            ).mappings().fetchall()

            albums = [dict(row) for row in result]

            for album in albums:
                if album["albumThumbnail"] :
                    album["albumThumbnail"] = BASE_URL + album["albumThumbnail"]

            return [AlbumDTO(**album) for album in albums]

        
    def update_album(self, album_id: int, album: AlbumUpdateDTO) -> Optional[AlbumDTO]:
        with self.session_context() as session:
            # Comprobar si existe
            result = session.execute(
                text('SELECT * FROM "Album" WHERE "idAlbum" = :id'),
                {"id": album_id}
            ).mappings().fetchone()

            if not result:
                return None

            fields = []
            params = {"id": album_id}

            for field, value in album.dict(exclude_unset=True).items():
                fields.append(f'"{field}" = :{field}')
                params[field] = value

            if fields:
                set_clause = ", ".join(fields)
                stmt = text(f'UPDATE "Album" SET {set_clause} WHERE "idAlbum" = :id')
                session.execute(stmt, params)
                session.commit()

            updated_album = session.execute(
                text('SELECT * FROM "Album" WHERE "idAlbum" = :id'),
                {"id": album_id}
            ).mappings().fetchone()

            if updated_album:
                updated_album_dict = dict(updated_album)
                if updated_album_dict["albumThumbnail"]:
                    updated_album_dict["albumThumbnail"] = BASE_URL + updated_album_dict["albumThumbnail"]
                return AlbumDTO(**updated_album_dict)

            return None    