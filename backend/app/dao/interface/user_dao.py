from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.user_schema import UserDTO, UserRegisterDTO, UserUpdateDTO


class UserDAO(ABC):
    @abstractmethod
    def get_all_artists(self) -> List[UserDTO]:
        pass
    
    @abstractmethod
    def get_all_users(self) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[UserDTO]:
        pass


    @abstractmethod
    def login_user(self, email: str, password: str) -> Optional[UserDTO]:
        pass
    
    @abstractmethod
    def register_user(self, user: UserRegisterDTO) -> UserDTO:
        pass

    @abstractmethod
    def delete_user(self, user_id: int) -> bool:
        pass

    @abstractmethod
    def update_user(self, user_id: int, user: UserUpdateDTO) -> Optional[UserDTO]:
        pass

    @abstractmethod
    def update_password(self, email: str, new_password: str) -> bool:
        pass

    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[UserDTO]:
        pass
    
    @abstractmethod
    def get_followers(self, user_id: int) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_followings(self, user_id: int) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_orders(self, user_id: int) -> List[UserDTO]:
        pass
    
    @abstractmethod
    def get_favorite_albums(self, user_id: int) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_favorite_songs(self, user_id: int) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_followed_artists(self, user_id: int) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_artists_ordered_by_name(self) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_artists_ordered_by_followers(self) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_artists_ordered_by_song_views(self) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_artists_by_country_and_genre(self, countries: List[str], genres: List[str]) -> List[UserDTO]:
        pass

    @abstractmethod
    def search_artists_by_name(self, name: str) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_filtered_artists(self, name: Optional[str], order: Optional[str]) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_songs_by_artist(self, artist_id: int) -> List[UserDTO]:
        pass

    @abstractmethod
    def get_albums_by_artist(self, artist_id: int) -> List[UserDTO]:
        pass

    @abstractmethod 
    def add_favorite_song(self, user_id: int, song_id: int) -> bool:
        pass