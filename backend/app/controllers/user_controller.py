from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserDTO
from app.schemas.user_register_schema import UserRegisterDTO
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory
from app.schemas.user_update_schema import UserUpdateDTO


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


@router.post("/register", response_model=UserDTO)
def register_user(user: UserRegisterDTO):
    try:
        return user_model.register_user(user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}")
def delete_user(user_id: int):
    deleted = user_model.delete_user(user_id)
    if deleted:
        return {"detail": f"Usuario con id {user_id} eliminado correctamente."}
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

@router.put("/{user_id}", response_model=UserDTO)
def update_user(user_id: int, user: UserUpdateDTO):
    updated = user_model.update_user(user_id, user)
    if updated:
        return updated
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

