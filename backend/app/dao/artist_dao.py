# app/dao/artist_dao.py
from app.model.artist_model import ArtistModel

class ArtistDAO:
    def __init__(self):
        self.db = FirebaseFactory.get_firestore()
        self.collection = self.db.collection('artists')

    def get_all_artists(self):
        docs = self.collection.stream()
        return [
            ArtistModel(
                id=doc.id,
                name=data.get("name"),
                image=data.get("image"),
                genre=data.get("genre"),
                country=data.get("country"),
                description=data.get("description"),
            )
            for doc in docs
            if (data := doc.to_dict())
        ]
