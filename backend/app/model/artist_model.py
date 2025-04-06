# app/model/artist_model.py
class ArtistModel:
    def __init__(self, id: str, ArtistName: str, image: str, genre: str, country: str, description: str):
        self.id = id
        self.ArtistName = ArtistName
        self.image = image
        self.genre = genre
        self.country = country
        self.description = description