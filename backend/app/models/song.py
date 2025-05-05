from app.factories.dao_factory import DAOFactory
from app.schemas.song_schema import SongDTO, SongUpdateDTO, SongUploadDTO
from typing import Optional, List

class Song:
    def __init__(self, dao_factory: DAOFactory):
        self.dao = dao_factory.create_song_dao()

    def get_all_songs(self) -> List[SongDTO]:
        return self.dao.get_all_songs()

    def get_song_by_id(self, song_id: int) -> Optional[SongDTO]:
        return self.dao.get_song_by_id(song_id)
    
    def delete_song(self, song_id: int) -> bool:
        return self.dao.delete_song(song_id)

    def update_song(self, song_id: int, song: SongUpdateDTO) -> Optional[SongUpdateDTO]:
        return self.dao.update_song(song_id, song)

    def upload_song(self, song: SongUploadDTO) -> SongDTO:
        return self.dao.upload_song(song)

