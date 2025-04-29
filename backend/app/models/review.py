from app.dao.interface.review_dao import ReviewDAO
from app.schemas.review_schema import ReviewDTO, ReviewCreateDTO, ReviewUpdateDTO
from typing import List

class Review:
    def __init__(self, dao_factory):
        self.dao: ReviewDAO = dao_factory.create_review_dao()

    def get_all_reviews(self) -> List[ReviewDTO]:
        return self.dao.get_all_reviews()

    def get_review_by_id(self, review_id: int) -> ReviewDTO:
        return self.dao.get_review_by_id(review_id)
    
    def get_reviews_by_product(self, product_id: int) -> List[ReviewDTO]:
        return self.dao.get_reviews_by_product(product_id)

    def create_review(self, review: ReviewCreateDTO) -> ReviewDTO:
        return self.dao.create_review(review)

    def update_review(self, review_id: int, review: ReviewUpdateDTO) -> ReviewDTO:
        return self.dao.update_review(review_id, review)

    def delete_review(self, review_id: int) -> bool:
        return self.dao.delete_review(review_id)
