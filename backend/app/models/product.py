from app.dao.interface.product_dao import ProductDAO
from app.schemas.product_schema import ProductDTO, ProductCreateDTO, ProductUpdateDTO
from typing import List

class Product:
    def __init__(self, dao_factory):
        self.dao: ProductDAO = dao_factory.create_product_dao()

    def get_all_products(self) -> List[ProductDTO]:
        return self.dao.get_all_products()

    def get_product_by_id(self, product_id: int) -> ProductDTO:
        return self.dao.get_product_by_id(product_id)
    
    def get_product_by_album_id(self, album_id: int) -> ProductDTO:
        return self.dao.get_product_by_album_id(album_id)
    
    def get_songs_by_album_id(self, album_id: int) -> List[ProductDTO]:
        return self.dao.get_songs_by_album_id(album_id)

    def create_product(self, product_data: ProductCreateDTO):
        return self.dao.create_product(product_data)

    def update_product(self, product_id: int, product_data: ProductUpdateDTO):
        return self.dao.update_product(product_id, product_data)

    def delete_product(self, product_id: int):
        return self.dao.delete_product(product_id)
