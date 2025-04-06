# app/factory/artist_factory.py
from app.model.artist_model import ArtistModel
from app.dto.artist_dto import ArtistDTO
import uuid

class ArtistFactory:

    @staticmethod
    def from_firestore(doc_id: str, data: dict) -> ArtistModel:
        return ArtistModel(
            id=doc_id,
            ArtistName=data.get("ArtistName"),
            image=data.get("image"),
            genre=data.get("genre"),
            country=data.get("country"),
            description=data.get("description"),
        )

    @staticmethod
    def from_dto(dto: ArtistDTO) -> ArtistModel:
        return ArtistModel(
            id=str(uuid.uuid4()),
            ArtistName=dto.ArtistName,
            image=dto.image,
            genre=dto.genre,
            country=dto.country,
            description=dto.description
        )
