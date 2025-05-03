from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.product_schema import ProductDTO, ProductCreateDTO, ProductUpdateDTO
from app.models.product import Product
from app.factories.postgres_factory import PostgresFactory

router = APIRouter(prefix="/products", tags=["Products"])
product_model = Product(PostgresFactory())

@router.get("/", response_model=List[ProductDTO])
def get_all_products():
    return product_model.get_all_products()

@router.get("/{product_id}", response_model=ProductDTO)
def get_product_by_id(product_id: int):
    product = product_model.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@router.get("/products/album/{album_id}", response_model=ProductDTO)
def get_product_by_album_id(album_id: int):
    product = product_model.get_product_by_album_id(album_id)
    if not product:
        raise HTTPException(status_code=404, detail="No product found for this album")
    return product

@router.get("/albums/{album_id}/songs", response_model=List[ProductDTO])
def get_songs_by_album_id(album_id: int):
    songs = product_model.get_songs_by_album_id(album_id)
    if not songs:
        raise HTTPException(status_code=404, detail="No se encontraron canciones para este álbum")
    return songs

@router.post("/", response_model=ProductDTO)
def create_product(product: ProductCreateDTO):
    return product_model.create_product(product)

@router.put("/{product_id}", response_model=ProductDTO)
def update_product(product_id: int, product: ProductUpdateDTO):
    return product_model.update_product(product_id, product)

@router.delete("/{product_id}", response_model=bool)
def delete_product(product_id: int):
    return product_model.delete_product(product_id)
