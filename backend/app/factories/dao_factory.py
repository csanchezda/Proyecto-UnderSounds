from abc import ABC, abstractmethod

class DAOFactory(ABC):
    @abstractmethod
    def create_user_dao(self): pass
    @abstractmethod
    def create_song_dao(self): pass
