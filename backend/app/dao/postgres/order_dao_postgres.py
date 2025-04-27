from sqlalchemy import text
from app.dao.interface.order_dao import OrderDAO
from app.schemas.order_schema import OrderDTO

class PostgresOrderDAO(OrderDAO):
    def __init__(self, db_session):
        self.db_session = db_session

    def create_order(self, order: OrderDTO) -> None:
        with self.db_session() as session:
            result = session.execute(
                text('SELECT * FROM "Orders" WHERE "idUser" = :idUser AND "idProduct" = :idProduct'),
                order.dict()
            ).fetchone()

            if result:
                print(f"⚠️ Orden ya existe para user {order.idUser} y producto {order.idProduct}")
                return

            session.execute(
                text('INSERT INTO "Orders" ("idUser", "idProduct") VALUES (:idUser, :idProduct)'),
                order.dict()
            )
            session.commit()


    def get_orders_by_user(self, user_id: int):
        with self.db_session() as session:
            result = session.execute(
                text('SELECT * FROM "Orders" WHERE "idUser" = :user_id'),
                {"user_id": user_id}
            ).mappings()
            return [OrderDTO(**row) for row in result.fetchall()]
