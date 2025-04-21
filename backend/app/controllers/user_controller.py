from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserDTO
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory

router = APIRouter(prefix="/users", tags=["Users"])

user_model = User(PostgresFactory())

@router.get("/", response_model=list[UserDTO])
def get_all_users():
    return user_model.get_all_users()

@router.get("/{user_id}", response_model=UserDTO)
def get_user_by_id(user_id: int):
    user = user_model.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user
