from sqlalchemy import text
from app.dao.interface.shopping_cart_dao import ShoppingCartDAO
from app.schemas.shopping_cart_schema import ShoppingCartDTO

class PostgresShoppingCartDAO(ShoppingCartDAO):
    def __init__(self, db_session):
        self.db_session = db_session

    def get_cart_items(self, user_id: int):
        with self.db_session() as session:
            result = session.execute(
                text('SELECT * FROM "ShoppingCart" WHERE "idUser" = :user_id'),
                {"user_id": user_id}
            ).mappings()
            return [ShoppingCartDTO(**row) for row in result.fetchall()]

    def add_item_to_cart(self, cart_item: ShoppingCartDTO):
        with self.db_session() as session:
            session.execute(
                text('INSERT INTO "ShoppingCart" ("idUser", "idProduct", "quantity") VALUES (:idUser, :idProduct, :quantity)'),
                cart_item.dict()
            )
            session.commit()

    def update_item_quantity(self, user_id: int, product_id: int, quantity: int):
        with self.db_session() as session:
            session.execute(
                text('UPDATE "ShoppingCart" SET "quantity" = :quantity WHERE "idUser" = :user_id AND "idProduct" = :product_id'),
                {"quantity": quantity, "user_id": user_id, "product_id": product_id}
            )
            session.commit()

    def remove_item_from_cart(self, user_id: int, product_id: int):
        with self.db_session() as session:
            session.execute(
                text('DELETE FROM "ShoppingCart" WHERE "idUser" = :user_id AND "idProduct" = :product_id'),
                {"user_id": user_id, "product_id": product_id}
            )
            session.commit()

    def clear_cart(self, user_id: int):
        with self.db_session() as session:
            session.execute(
                text('DELETE FROM "ShoppingCart" WHERE "idUser" = :user_id'),
                {"user_id": user_id}
            )
            session.commit()
