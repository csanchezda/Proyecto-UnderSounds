from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.user_schema import UserDTO
from app.schemas.user_register_schema import UserRegisterDTO

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
    def register_user(self, user: UserRegisterDTO) -> UserDTO:
        pass

    @abstractmethod
    def delete_user(self, user_id: int) -> bool:
        pass
