from fastapi import APIRouter, HTTPException
from typing import List
from app.models.review import Review
from app.factories.postgres_factory import PostgresFactory
from app.schemas.review_schema import ReviewDTO, ReviewCreateDTO, ReviewUpdateDTO

router = APIRouter(prefix="/reviews", tags=["Reviews"])
review_model = Review(PostgresFactory())

@router.get("/", response_model=List[ReviewDTO])
def get_all_reviews():
    return review_model.get_all_reviews()

@router.get("/{review_id}", response_model=ReviewDTO)
def get_review_by_id(review_id: int):
    review = review_model.get_review_by_id(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review no encontrada")
    return review

@router.get("/product/{product_id}", response_model=List[ReviewDTO])
def get_reviews_by_product(product_id: int):
    return review_model.get_reviews_by_product(product_id)

@router.post("/", response_model=ReviewDTO)
def create_review(review: ReviewCreateDTO):
    return review_model.create_review(review)

@router.put("/{review_id}", response_model=ReviewDTO)
def update_review(review_id: int, review: ReviewUpdateDTO):
    return review_model.update_review(review_id, review)

@router.delete("/{review_id}", response_model=bool)
def delete_review(review_id: int):
    return review_model.delete_review(review_id)