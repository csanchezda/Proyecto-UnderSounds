from app.factories.dao_factory import DAOFactory
from app.schemas.user_register_schema import UserRegisterDTO
from app.schemas.user_schema import UserDTO
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
