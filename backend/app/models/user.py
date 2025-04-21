from app.factories.dao_factory import DAOFactory

class User:
    def __init__(self, dao_factory: DAOFactory):
        self.dao = dao_factory.create_user_dao()

    def get_all_artists(self):
        return self.dao.get_all_artists()

    def get_all_users(self):
        return self.dao.get_all_users()

    def get_user_by_id(self, user_id: int):
        return self.dao.get_user_by_id(user_id)