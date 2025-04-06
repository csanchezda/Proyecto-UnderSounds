# app/dao/artist_dao.py
from app.model.artist_model import ArtistModel
from app.factory.artist_factory import ArtistFactory
from app.firebase_config import db  # Ya correcto

class ArtistDAO:
    def __init__(self):
        self.collection = db.collection('artists')

    def get_all_artists(self):
        docs = self.collection.stream()
        return [
            ArtistFactory.from_firestore(doc.id, doc.to_dict())
            for doc in docs
            if doc.exists
        ]

    def save_artist(self, artist: ArtistModel):
        self.collection.document(artist.id).set(artist.__dict__)
