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
                text('DELETE FROM "Songs" WHERE "idSong" = : id'),
                {"id"
                 : song_id}
            )
            session.commit()
            return True

    
    def update_song(self, song_id:int, song:SongDTO):
        with self.session_context() as session:
            result = session.execute (
                text('SELECT FROM "Songs" WHERE "idSong" = :id '),
                {"id": song_id}
            ).mappings().fetchone()

            if not result:
                return None
            
            fields = []
            params = {"id": song_id}
            
            for field, value in song.dict(exclude_unset=True).items():
                fields.append(f'"{field}" = :{field}')
                params[field] = value
            
            if fields:
                query = f'UPDATE "Songs" SET {", ".join(fields)} WHERE "idSong" = :id'
                session.execute(text(query), params)
                session.commit()

            result = session.execute(
                text('SELECT * FROM "Songs" WHERE "idSong" = :id'),
                {"id": song_id}
            ).mappings().fetchone()

            song = dict(result)
            if song["thumbnail"]:
                song["thumbnail"] = BASE_URL + song["thumbnail"]

        return SongUpdateDTO(**song)    
    
    
    def upload_song(self, song: SongUploadDTO):
        song_dict = song.dict()

        # Procesa el campo "thumbnail" (convierte base64 a archivo)
        if song_dict.get("thumbnail"):
            thumbnail_base64 = song_dict["thumbnail"]
            # Elimina el prefijo "data:image/png;base64," si está presente
            if thumbnail_base64.startswith("data:image"):
                thumbnail_base64 = thumbnail_base64.split(",")[1]

            # Decodifica el string base64
            thumbnail_data = base64.b64decode(thumbnail_base64)

            # Define la ruta de salida para guardar el archivo
            output_directory = "uploads/thumbnails"
            os.makedirs(output_directory, exist_ok=True)  # Crea el directorio si no existe
            output_path = os.path.join(output_directory, f"{song_dict['name']}_thumbnail.png")

            # Guarda el archivo
            with open(output_path, "wb") as file:
                file.write(thumbnail_data)

            # Actualiza el campo "thumbnail" con la ruta del archivo
            song_dict["thumbnail"] = output_path.replace("\\", "/")

        # Normaliza las rutas de los archivos
        if song_dict.get("wav"):
            song_dict["wav"] = song_dict["wav"].replace("\\", "/")
        if song_dict.get("flac"):
            song_dict["flac"] = song_dict["flac"].replace("\\", "/")
        if song_dict.get("mp3"):
            song_dict["mp3"] = song_dict["mp3"].replace("\\", "/")

        # Mapea los nombres de los campos para que coincidan con la base de datos
        song_dict["id_user"] = song_dict.pop("idUser")
        song_dict["song_duration"] = song_dict.pop("songDuration")
        song_dict["song_release_date"] = song_dict.pop("songReleaseDate")

        # Convierte la lista de géneros en una cadena separada por comas
        if song_dict.get("genre"):
            song_dict["genre"] = ", ".join(song_dict["genre"])

        query = """
        INSERT INTO "Songs" (id_user, name, description, song_duration, price, song_release_date, thumbnail, wav, flac, mp3, genre)
        VALUES (:id_user, :name, :description, :song_duration, :price, :song_release_date, :thumbnail, :wav, :flac, :mp3, :genre)
        RETURNING *;
        """
        with self.session_context() as session:
            result = session.execute(text(query), song_dict).mappings().fetchone()
            session.commit()

        return SongDTO(**result)
    