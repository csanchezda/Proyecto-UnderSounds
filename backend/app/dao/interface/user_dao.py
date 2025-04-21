from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.user_schema import UserDTO

class UserDAO(ABC):
    @abstractmethod
    def get_all_artists(self) -> List[UserDTO]:
        pass
    
    @abstractmethod
    def get_all_users(self) -> List[UserDTO]: pass

    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[UserDTO]: pass