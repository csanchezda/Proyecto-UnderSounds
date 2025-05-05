from app.factories.dao_factory import DAOFactory
from app.schemas.album_schema import AlbumDTO, AlbumUploadDTO, AlbumUpdateDTO
from typing import Optional, List, Dict

class Album:
    def __init__(self, dao_factory: DAOFactory):
        self.dao = dao_factory.create_album_dao()

    def get_all_albums(self) -> List[AlbumDTO]:
        return self.dao.get_all_albums()

    def get_album_by_id(self, album_id: int) -> Optional[AlbumDTO]:
        return self.dao.get_album_by_id(album_id)
    
    def get_songs_by_album_id(self, album_id: int) -> List[dict]:
        return self.dao.get_songs_by_album_id(album_id)
    
    def get_artist_name_by_id(self, album_id: int) -> Optional[str]:
        return self.dao.get_artist_name_by_id(album_id)

    def create_album(self, album_data: AlbumUploadDTO, songs: List[Dict]) -> int:
        return self.dao.create_album(album_data, songs)

    def delete_album(self, album_id: int) -> bool:
        return self.dao.delete_album(album_id)
    
    def get_albums_by_user_id(self, user_id: int) -> List[AlbumDTO]:
        return self.dao.get_albums_by_user_id(user_id)

    def update_album(self, album_id: int, album: AlbumUpdateDTO) -> Optional[AlbumDTO]:
        return self.dao.update_album(album_id, album)
    
    def upload_album(self, album: AlbumUploadDTO) -> AlbumDTO:
        return self.dao.upload_album(album)