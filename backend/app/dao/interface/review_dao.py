from abc import ABC, abstractmethod
from typing import List
from app.schemas.review_schema import ReviewDTO, ReviewCreateDTO, ReviewUpdateDTO

class ReviewDAO(ABC):
    @abstractmethod
    def get_all_reviews(self) -> List[ReviewDTO]:
        pass

    @abstractmethod
    def get_review_by_id(self, review_id: int) -> ReviewDTO:
        pass

    @abstractmethod
    def get_reviews_by_product(self, product_id: int) -> List[ReviewDTO]:
        pass

    @abstractmethod
    def create_review(self, review: ReviewCreateDTO) -> ReviewDTO:
        pass

    @abstractmethod
    def update_review(self, review_id: int, review: ReviewUpdateDTO) -> ReviewDTO:
        pass

    @abstractmethod
    def delete_review(self, review_id: int) -> bool:
        pass
