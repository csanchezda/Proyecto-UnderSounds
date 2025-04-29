from app.dao.interface.product_dao import ProductDAO
from app.schemas.product_schema import ProductDTO, ProductCreateDTO, ProductUpdateDTO
from sqlalchemy import text
from typing import List, Optional

BASE_URL = "http://localhost:8000/static/"

class PostgresProductDAO(ProductDAO):
    def __init__(self, session_context):
        self.session_context = session_context

    def get_all_products(self) -> List[ProductDTO]:
        with self.session_context() as session:
            query = text("""
                SELECT p."idProduct", p."isSong", p."idAlbum",
                    COALESCE(s."name", a."name") AS title,
                    COALESCE(s."description", a."description") AS description,
                    COALESCE(s."thumbnail", a."albumThumbnail") AS image,
                    COALESCE(s."price", a."price") AS price,
                    COALESCE(TO_CHAR(s."songReleaseDate", 'YYYY-MM-DD'), TO_CHAR(a."albumRelDate", 'YYYY-MM-DD')) AS date,
                    COALESCE(u."userName", u2."userName") AS "artistName",
                    COALESCE(s."wav", a."wav") AS wav,
                    COALESCE(s."flac", a."flac") AS flac,
                    COALESCE(s."mp3", a."mp3") AS mp3,
                    (SELECT ROUND(AVG(r."rating")::numeric, 1) FROM "Review" r WHERE r."idProduct" = p."idProduct") AS "averageRating"
                FROM "Product" p
                LEFT JOIN "Songs" s ON p."idSong" = s."idSong"
                LEFT JOIN "Album" a ON p."idAlbum" = a."idAlbum"
                LEFT JOIN "User" u ON s."idUser" = u."idUser"
                LEFT JOIN "User" u2 ON a."idUser" = u2."idUser"
            """)
            result = session.execute(query).mappings().fetchall()
            return [ProductDTO(**self._normalize_product(dict(row))) for row in result]

    def get_product_by_id(self, product_id: int) -> Optional[ProductDTO]:
        with self.session_context() as session:
            query = text("""
                SELECT p."idProduct", p."isSong", p."idAlbum",
                    COALESCE(s."name", a."name") AS title,
                    COALESCE(s."description", a."description") AS description,
                    COALESCE(s."thumbnail", a."albumThumbnail") AS image,
                    COALESCE(s."price", a."price") AS price,
                    COALESCE(TO_CHAR(s."songReleaseDate", 'YYYY-MM-DD'), TO_CHAR(a."albumRelDate", 'YYYY-MM-DD')) AS date,
                    COALESCE(u."userName", u2."userName") AS "artistName",
                    COALESCE(s."wav", a."wav") AS wav,
                    COALESCE(s."flac", a."flac") AS flac,
                    COALESCE(s."mp3", a."mp3") AS mp3,
                    (SELECT ROUND(AVG(r."rating")::numeric, 1) FROM "Review" r WHERE r."idProduct" = p."idProduct") AS "averageRating"
                FROM "Product" p
                LEFT JOIN "Songs" s ON p."idSong" = s."idSong"
                LEFT JOIN "Album" a ON p."idAlbum" = a."idAlbum"
                LEFT JOIN "User" u ON s."idUser" = u."idUser"
                LEFT JOIN "User" u2 ON a."idUser" = u2."idUser"
                WHERE p."idProduct" = :id
            """)
            result = session.execute(query, {"id": product_id}).mappings().fetchone()
            return ProductDTO(**self._normalize_product(dict(result))) if result else None

    def get_songs_by_album_id(self, album_id: int) -> List[ProductDTO]:
        with self.session_context() as session:
            query = text("""
                SELECT p."idProduct",
                    TRUE as "isSong",
                    :album_id AS "idAlbum",
                    s."name" AS title,
                    s."description",
                    s."thumbnail" AS image,
                    s."price",
                    TO_CHAR(s."songReleaseDate", 'YYYY-MM-DD') AS date,
                    u."userName" AS "artistName",
                    s."wav",
                    s."flac",
                    s."mp3",
                    (SELECT ROUND(AVG(r."rating")::numeric, 1) FROM "Review" r WHERE r."idProduct" = p."idProduct") AS "averageRating"
                FROM "AlbumSongRelation" asr
                JOIN "Songs" s ON asr."idSong" = s."idSong"
                JOIN "Product" p ON p."idSong" = s."idSong"
                JOIN "User" u ON s."idUser" = u."idUser"
                WHERE asr."idAlbum" = :album_id
            """)
            result = session.execute(query, {"album_id": album_id}).mappings().fetchall()
            return [ProductDTO(**self._normalize_product(dict(row))) for row in result]

    def _normalize_product(self, product: dict) -> dict:
        if product.get("image"):
            product["image"] = BASE_URL + product["image"]
        return product

    def create_product(self, product: ProductCreateDTO) -> ProductDTO:
        with self.session_context() as session:
            insert_query = text("""
                INSERT INTO "Product" ("isSong", "idSong", "idAlbum")
                VALUES (:isSong, :idSong, :idAlbum)
                RETURNING "idProduct"
            """)
            result = session.execute(insert_query, product.dict()).fetchone()
            session.commit()
            return self.get_product_by_id(result.idProduct)

    def update_product(self, product_id: int, product: ProductUpdateDTO) -> ProductDTO:
        with self.session_context() as session:
            update_query = text("""
                UPDATE "Product"
                SET "isSong" = COALESCE(:isSong, "isSong"),
                    "idSong" = COALESCE(:idSong, "idSong"),
                    "idAlbum" = COALESCE(:idAlbum, "idAlbum")
                WHERE "idProduct" = :id
            """)
            session.execute(update_query, {**product.dict(), "id": product_id})
            session.commit()
            return self.get_product_by_id(product_id)

    def delete_product(self, product_id: int) -> bool:
        with self.session_context() as session:
            session.execute(text('DELETE FROM "Product" WHERE "idProduct" = :id'), {"id": product_id})
            session.commit()
            return True
