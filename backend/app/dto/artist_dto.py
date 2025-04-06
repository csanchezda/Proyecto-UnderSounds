from app.firebase_config import db  # Asegúrate de que esta importación sea correcta
from pydantic import BaseModel

class ArtistDTO(BaseModel):
    id: str
    ArtistName: str
    genre: str
    image: str
    country: str
    description: str
    # otros campos según tu estructura en Firestore

    @classmethod
    def get_all_artists(cls):
        # Ahora 'db' está definido, por lo que esta línea funcionará
        artists_ref = db.collection('artists')
        docs = artists_ref.stream()

        artists = []
        for doc in docs:
            artist_data = doc.to_dict()  # Convierte el documento a un diccionario
            artists.append(cls(**artist_data))  # Crea una instancia de ArtistDTO con los datos


        return artists
