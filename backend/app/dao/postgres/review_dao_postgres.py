from app.dao.interface.review_dao import ReviewDAO
from app.schemas.review_schema import ReviewDTO, ReviewCreateDTO, ReviewUpdateDTO
from sqlalchemy import text
from typing import List
from datetime import datetime

BASE_URL = "http://localhost:8000/static/"

class PostgresReviewDAO(ReviewDAO):
    def __init__(self, session_context):
        self.session_context = session_context

    def get_all_reviews(self) -> List[ReviewDTO]:
        with self.session_context() as session:
            query = text('''
                SELECT r."idReview", r."idProduct", r."idUser", u."userName", u."profilePicture",
                       r."comment" as review, r."rating", TO_CHAR(r."publishDate", 'YYYY-MM-DD') as date
                FROM "Review" r
                JOIN "User" u ON r."idUser" = u."idUser"
            ''')
            result = session.execute(query).mappings().fetchall()

            reviews = [dict(row) for row in result]

            for review in reviews:
                if review["profilePicture"]:
                    review["profilePicture"] = BASE_URL + review["profilePicture"]

            return [ReviewDTO(**review) for review in reviews]

    def get_review_by_id(self, review_id: int) -> ReviewDTO:
        with self.session_context() as session:
            query = text('''
                SELECT r."idReview", r."idProduct", r."idUser", u."userName", u."profilePicture",
                       r."comment" as review, r."rating", TO_CHAR(r."publishDate", 'YYYY-MM-DD') as date
                FROM "Review" r
                JOIN "User" u ON r."idUser" = u."idUser"
                WHERE r."idReview" = :id
            ''')
            result = session.execute(query, {"id": review_id}).mappings().fetchone()

            if result:
                review = dict(result)
                if review["profilePicture"]:
                    review["profilePicture"] = BASE_URL + review["profilePicture"]
                return ReviewDTO(**review)
            return None
        
    def get_reviews_by_product(self, product_id: int) -> List[ReviewDTO]:
        with self.session_context() as session:
            query = text('''
                SELECT r."idReview", r."idProduct", r."idUser", u."userName", u."profilePicture",
                    r."comment" as review, r."rating", TO_CHAR(r."publishDate", 'YYYY-MM-DD') as date
                FROM "Review" r
                JOIN "User" u ON r."idUser" = u."idUser"
                WHERE r."idProduct" = :idProduct
            ''')
            result = session.execute(query, {"idProduct": product_id}).mappings().fetchall()

            reviews = [dict(row) for row in result]

            for review in reviews:
                if review["profilePicture"]:
                    review["profilePicture"] = BASE_URL + review["profilePicture"]

            return [ReviewDTO(**review) for review in reviews]

    def create_review(self, review: ReviewCreateDTO) -> ReviewDTO:
        with self.session_context() as session:
            insert_query = text('''
                INSERT INTO "Review" ("idProduct", "idUser", "comment", "rating", "publishDate")
                VALUES (:idProduct, :idUser, :review, :rating, :publishDate)
                RETURNING "idReview"
            ''')
            publish_date = review.date if hasattr(review, 'date') and review.date else datetime.now().strftime("%Y-%m-%d")

            params = {
                "idProduct": review.idProduct,
                "idUser": review.idUser,
                "review": review.review,
                "rating": review.rating,
                "publishDate": publish_date
            }

            result = session.execute(insert_query, params).fetchone()
            session.commit()
            return self.get_review_by_id(result.idReview)

    def update_review(self, review_id: int, review: ReviewUpdateDTO) -> ReviewDTO:
        with self.session_context() as session:
            fields = []
            params = {"id": review_id}

            for field, value in review.dict(exclude_unset=True).items():
                if field == "review":
                    db_field = "comment"
                elif field == "date":
                    db_field = "publishDate"
                else:
                    db_field = field

                fields.append(f'"{db_field}" = :{field}')
                params[field] = value

            update_query = f'UPDATE "Review" SET {", ".join(fields)} WHERE "idReview" = :id'
            session.execute(text(update_query), params)
            session.commit()
            return self.get_review_by_id(review_id)

    def delete_review(self, review_id: int) -> bool:
        with self.session_context() as session:
            session.execute(text('DELETE FROM "Review" WHERE "idReview" = :id'), {"id": review_id})
            session.commit()
            return True
