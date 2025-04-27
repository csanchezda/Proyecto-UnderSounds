from fastapi import APIRouter, HTTPException, Request
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory
from app.schemas.user_schema import UserDTO, UserRegisterDTO, UserUpdateDTO, UserUpdatePasswordDTO



router = APIRouter(prefix="/users", tags=["Users"])

user_model = User(PostgresFactory())

@router.get("/", response_model=list[UserDTO])
def get_all_users():
    return user_model.get_all_users()

@router.put("/update-password")
async def update_password(request: Request, user_update_password: UserUpdatePasswordDTO):
    json_data = await request.json()
    print("DEBUG BODY RAW:", json_data)
    print("DEBUG PARSED DTO:", user_update_password)
    updated = user_model.update_password(user_update_password)
    if updated:
        return {"detail": "Contraseña actualizada correctamente."}
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")


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

from fastapi import Body

@router.post("/login", response_model=UserDTO)
def login_user(email: str = Body(...), password: str = Body(...)):
    user = user_model.login_user(email, password)
    if user:
        return user
    raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")


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
        

