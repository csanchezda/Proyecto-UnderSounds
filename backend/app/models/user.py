from app.factories.dao_factory import DAOFactory
from app.schemas.user_schema import UserDTO, UserRegisterDTO, UserUpdateDTO, AlbumDTO, SongDTO, OrderDTO, UserUpdatePasswordDTO
from typing import Optional, List

class User:
    def __init__(self, dao_factory: DAOFactory):
        self.dao = dao_factory.create_user_dao()

    def get_all_artists(self, nationalities: Optional[List[str]] = None) -> List[UserDTO]:
        return self.dao.get_all_artists(nationalities=nationalities)

    def get_all_users(self) -> List[UserDTO]:
        return self.dao.get_all_users()

    def get_user_by_id(self, user_id: int) -> Optional[UserDTO]:
        return self.dao.get_user_by_id(user_id)

    def register_user(self, user: UserRegisterDTO) -> UserDTO:
        return self.dao.register_user(user)

    def delete_user(self, user_id: int) -> bool:
        return self.dao.delete_user(user_id)

    def update_user(self, user_id: int, user: UserUpdateDTO) -> Optional[UserDTO]:
        return self.dao.update_user(user_id, user)

    def login_user(self, email: str, password: str) -> Optional[UserDTO]:
        return self.dao.login_user(email, password)

    def update_password(self, user_update_password: UserUpdatePasswordDTO) -> bool:
        return self.dao.update_password(user_update_password.email, user_update_password.password)

    def get_user_by_email(self, email: str) -> UserDTO:
        return self.dao.get_user_by_email(email)
    def get_followers(self, followed_id: int) -> List[UserDTO]:
        return self.dao.get_followers(followed_id)
    
    def get_followings(self, follower_id: int) -> List[UserDTO]:
        return self.dao.get_followings(follower_id)
    
    def get_favorite_albums(self, user_id: int) -> List[AlbumDTO]:
        return self.dao.get_favorite_albums(user_id)
    
    def get_favorite_songs(self, user_id: int) -> List[SongDTO]:
        return self.dao.get_favorite_songs(user_id)

    def get_orders(self, user_id: int) -> List[OrderDTO]:
        return self.dao.get_orders(user_id)
    
    def follow_user(self, follower_id: int, followed_id: int) -> bool:
        return self.dao.follow_user(follower_id, followed_id)
    
    def unfollow_user(self, follower_id: int, followed_id: int) -> bool:
        return self.dao.unfollow_user(follower_id, followed_id)
    
    def is_following(self, follower_id: int, followed_id: int) -> bool:
        return self.dao.is_following(follower_id, followed_id)

    def get_favorite_songs(self, user_id: int) -> List[UserDTO]:
        return self.dao.get_favorite_songs(user_id)

    def get_followed_artists(self, user_id: int) -> List[UserDTO]:
        return self.dao.get_followed_artists(user_id)

    def get_artists_ordered_by_name(self) -> List[UserDTO]:
        return self.dao.get_artists_ordered_by_name()

    def get_artists_ordered_by_followers(self) -> List[UserDTO]:
        return self.dao.get_artists_ordered_by_followers()

    def get_artists_ordered_by_song_views(self) -> List[UserDTO]:
        return self.dao.get_artists_ordered_by_song_views()

    def get_artists_by_country_and_genre(self, countries: List[str], genres: List[str]) -> List[UserDTO]:
        return self.dao.get_artists_by_country_and_genre(countries, genres)

    def search_artists_by_name(self, name: str) -> List[UserDTO]:
        return self.dao.search_artists_by_name(name)

    def get_filtered_artists(self, name: Optional[str], order: Optional[str]) -> List[UserDTO]:
        return self.dao.get_filtered_artists(name, order)

    def get_songs_by_artist(self, artist_id: int) -> List[SongDTO]:
        return self.dao.get_songs_by_artist(artist_id)
    
    def get_albums_by_artist(self, artist_id: int) -> List[AlbumDTO]:
        return self.dao.get_albums_by_artist(artist_id)

    def add_favorite_song(self, user_id, song_id):
        return self.dao.add_favorite_song(user_id, song_id)
    