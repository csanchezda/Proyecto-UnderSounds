from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from app.schemas.album_schema import AlbumDTO, AlbumUploadDTO, AlbumUpdateDTO


class AlbumDAO(ABC):
    @abstractmethod
    def get_all_albums(self) -> List[AlbumDTO]:
        pass

    @abstractmethod
    def get_album_by_id(self, album_id: int) -> Optional[AlbumDTO]:
        pass

    @abstractmethod
    def upload_album(self, album:AlbumUploadDTO) -> AlbumDTO:
        pass

    @abstractmethod
    def delete_album(self, album_id: int) -> bool:
        pass

    @abstractmethod
    def update_album(self, album_id: int, album: AlbumUpdateDTO) -> Optional[AlbumDTO]:
        pass