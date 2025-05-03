from abc import ABC, abstractmethod
from typing import List
from app.schemas.product_schema import ProductDTO, ProductCreateDTO, ProductUpdateDTO

class ProductDAO(ABC):
    @abstractmethod
    def get_all_products(self) -> List[ProductDTO]:
        pass

    @abstractmethod
    def get_product_by_id(self, product_id: int) -> ProductDTO:
        pass

    @abstractmethod
    def get_product_by_album_id(self, album_id: int) -> ProductDTO:
        pass

    @abstractmethod
    def create_product(self, product: ProductCreateDTO) -> ProductDTO:
        pass

    @abstractmethod
    def update_product(self, product_id: int, product: ProductUpdateDTO) -> ProductDTO:
        pass

    @abstractmethod
    def delete_product(self, product_id: int) -> bool:
        pass
