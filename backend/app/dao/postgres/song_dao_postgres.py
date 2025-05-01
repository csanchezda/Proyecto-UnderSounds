from sqlalchemy import text
from sqlalchemy import text, bindparam
from typing import Optional, List
from app.dao.interface.song_dao import SongDAO
from app.schemas.song_schema import SongDTO, SongUpdateDTO, SongUploadDTO
from sqlalchemy.sql import text
import base64, os
BASE_URL = "http://localhost:8000/static/"


class PostgresSongDAO(SongDAO):

    def __init__(self, session_context):
        self.session_context = session_context

    def get_all_songs(self):
        with self.session_context() as session:
            result = session.execute(
                text('''
                    SELECT 
                        s.*, 
                        COALESCE(u."name", 'Artista Desconocido') AS artistName,
                        STRING_AGG(g."genreName", ', ') AS genres
                    FROM 
                        "Songs" s
                    LEFT JOIN 
                        "User" u ON s."idUser" = u."idUser"
                    LEFT JOIN 
                        "GenreSongRelation" gsr ON s."idSong" = gsr."idSong"
                    LEFT JOIN 
                        "Genre" g ON gsr."idGenre" = g."idGenre"
                    GROUP BY 
                    s."idSong", u."name"
                ''')
            ).mappings()

            songs = [dict(row) for row in result.fetchall()]
            for song in songs:
                if song["thumbnail"]:
                    if song["thumbnail"].startswith("iVBORw0KGgoAAAANSUhEUg"):
                        song["thumbnail"] = f"data:image/png;base64,{song['thumbnail']}"
                    
                    elif song["thumbnail"].startswith("data:image/png;base64,") or song["thumbnail"].startswith("http"):    
                        pass
                    elif song["thumbnail"].startswith("images"):
                        song["thumbnail"] = BASE_URL + song["thumbnail"].strip()
               
                
                if song["mp3"]:
                    song["mp3"] = BASE_URL + song["mp3"].strip()
                
                if song["wav"]:
                    song["wav"] = BASE_URL + song["wav"].strip()
                
                if song["flac"]:
                    song["flac"] = BASE_URL + song["flac"].strip()
                
                song["artistName"] = song.pop("artistname", None) 
                song["genre"] = song["genres"].split(", ") if song["genres"] else []
                song.pop("genres", None) 
            
            return [SongDTO(**song) for song in songs]
        
    def get_song_by_id(self, song_id: int):
        with self.session_context() as session:
            result = session.execute(
                text('''
                    SELECT 
                        s.*, 
                        COALESCE(u."name", 'Artista Desconocido') AS artistName,
                        STRING_AGG(g."genreName", ', ') AS genres
                    FROM 
                        "Songs" s
                    LEFT JOIN 
                        "User" u ON s."idUser" = u."idUser"
                    LEFT JOIN 
                        "GenreSongRelation" gsr ON s."idSong" = gsr."idSong"
                    LEFT JOIN 
                        "Genre" g ON gsr."idGenre" = g."idGenre"
                    WHERE 
                        s."idSong" = :id
                    GROUP BY 
                    s."idSong", u."name"
                '''),
                {"id": song_id}
            ).mappings().fetchone()
            if result:
                song = dict(result)
                if song["thumbnail"]:
                    if song["thumbnail"].startswith("iVBORw0KGgoAAAANSUhEUg"):
                        song["thumbnail"] = f"data:image/png;base64,{song['thumbnail']}"
                    
                    elif song["thumbnail"].startswith("data:image/png;base64,") or song["thumbnail"].startswith("http"):    
                        pass
                    elif song["thumbnail"].startswith("images"):
                        song["thumbnail"] = BASE_URL + song["thumbnail"].strip()
                
                if song["mp3"]:
                    song["mp3"] = BASE_URL + song["mp3"].strip()
                
                if song["wav"]:
                    song["wav"] = BASE_URL + song["wav"].strip()
                
                if song["flac"]:
                    song["flac"] = BASE_URL + song["flac"].strip()
                
                song["artistName"] = song.pop("artistname", None)  
                song["genre"] = song["genres"].split(", ") if song["genres"] else []
                song.pop("genres", None)

                return SongDTO(**song)

            return None      

    
    def delete_song(self, song_id:int):
        with self.session_context() as session:
            result = session.execute(
                text('SELECT * FROM "Songs" WHERE "idSong" = :id'),
                {"id": song_id}
            ).fetchone()
            
            if not result:
                return None
            
            session.execute(
                text('DELETE FROM "Songs" WHERE "idSong" = :id'),
                {"id"
                 : song_id}
            )
            session.commit()
            return True

    
    def update_song(self, song_id: int, song: SongUpdateDTO):
        with self.session_context() as session:
            # Verifica si la canción existe
            result = session.execute(
                text('''
                    SELECT 
                        s.*, 
                        STRING_AGG(g."genreName", ', ') AS genres
                    FROM 
                        "Songs" s
                    LEFT JOIN 
                        "GenreSongRelation" gsr ON s."idSong" = gsr."idSong"
                    LEFT JOIN 
                        "Genre" g ON gsr."idGenre" = g."idGenre"
                    WHERE 
                        s."idSong" = :id
                    GROUP BY 
                    s."idSong"
                '''),
                {"id": song_id}
            ).mappings().fetchone()

            if not result:
                return None

            # Construye dinámicamente la consulta de actualización
            fields = []
            params = {"id": song_id}

            for field, value in song.dict(exclude_unset=True).items():
                if field == "genre" and isinstance(value, list):
                    value = ", ".join(value)
                fields.append(f'"{field}" = :{field}')
                params[field] = value

            if fields:
                query = f'UPDATE "Songs" SET {", ".join(fields)} WHERE "idSong" = :id'
                session.execute(text(query), params)
                session.commit()

            # Recupera la canción actualizada
            result = session.execute(
                text('SELECT * FROM "Songs" WHERE "idSong" = :id'),
                {"id": song_id}
            ).mappings().fetchone()

            if not result:
                return None

            song = dict(result)
            if song["thumbnail"] and not song["thumbnail"].startswith("http"):
                song["thumbnail"] = BASE_URL + song["thumbnail"]

            return SongDTO(**song) 
    
    def upload_song(self, song: SongUploadDTO):
        song_dict = song.dict()

        # Normaliza las rutas de los archivos
        if song_dict.get("wav"):
            song_dict["wav"] = song_dict["wav"].replace("\\", "/")
        if song_dict.get("flac"):
            song_dict["flac"] = song_dict["flac"].replace("\\", "/")
        if song_dict.get("mp3"):
            song_dict["mp3"] = song_dict["mp3"].replace("\\", "/")

        
        if song_dict.get("genre"):
            song_dict["genre"] = ", ".join(song_dict["genre"])

        if song_dict.get("thumbnail"):
            if song_dict["thumbnail"].startswith("data:image"):
                song_dict["thumbnail"] = song_dict["thumbnail"].split(",")[1]
        

        song_dict["songDuration"] = song_dict.pop("songDuration")  
        song_dict["songReleaseDate"] = song_dict.pop("songReleaseDate")

        query = """
        INSERT INTO "Songs" ("idUser", name, description, "songDuration", price, "songReleaseDate", thumbnail, wav, flac, mp3)
        VALUES (:idUser, :name, :description, :songDuration, :price, :songReleaseDate, :thumbnail, :wav, :flac, :mp3)
        RETURNING *;
        """
        with self.session_context() as session:
            result = session.execute(text(query), song_dict).mappings().fetchone()
            session.commit()

        return SongDTO(**result)
    