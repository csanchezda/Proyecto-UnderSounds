from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.song_schema import SongDTO, SongUpdateDTO, SongUploadDTO

class SongDAO(ABC):
    @abstractmethod
    def get_all_songs(self)-> List[SongDTO]:
        pass

    @abstractmethod
    def get_song_by_id(self, song_id:int) -> Optional[SongDTO]:
        pass

    @abstractmethod
    def delete_song(self, song_id:int) -> bool:
        pass

    @abstractmethod
    def update_song(self, song_id:int, song:SongDTO) -> Optional[SongDTO]:
        pass

    @abstractmethod
    def upload_song(self, song:SongUploadDTO) -> SongDTO:
        pass