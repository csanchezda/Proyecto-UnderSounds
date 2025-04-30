from fastapi import APIRouter, HTTPException, Request, Body, Depends, Security, File, UploadFile
from fastapi.security import HTTPBearer
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory
from app.schemas.user_schema import UserDTO, UserRegisterDTO, UserUpdateDTO, UserUpdatePasswordDTO, AlbumDTO, SongDTO, OrderDTO
from app.middlewares.firebase_auth import firebase_auth
import os, shutil



router = APIRouter(prefix="/users", tags=["Users"])
auth_scheme = HTTPBearer()
user_model = User(PostgresFactory())

@router.get("/", response_model=list[UserDTO])
def get_all_users():
    return user_model.get_all_users()

@router.get("/me", response_model=UserDTO, dependencies=[Security(auth_scheme)])
async def get_current_user(current_user: UserDTO = Depends(firebase_auth)):
    return current_user


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

@router.get("/{user_id}/followers", response_model=list[UserDTO])
def get_followers(user_id: int):
    followers = user_model.get_followers(user_id)
    if not followers:
        raise HTTPException(status_code=404, detail="No se encontraron seguidores.")
    return followers

@router.get("/{user_id}/followings", response_model=list[UserDTO])
def get_followings(user_id: int):
    followings = user_model.get_followings(user_id)
    if not followings:
        raise HTTPException(status_code=404, detail="No se encontraron usuarios seguidos.")
    return followings

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

UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_image(profilePicture: UploadFile = File(...)):
    try:
        # Genera la ruta del archivo
        file_path = os.path.join(UPLOAD_DIR, profilePicture.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profilePicture.file, buffer)

        # Devuelve la URL pública del archivo
        file_url = f"http://localhost:8000/uploaded_images/{profilePicture.filename}"
        return {"imageUrl": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir la imagen: {str(e)}")

@router.get("/{user_id}/favorite-albums", response_model=list[AlbumDTO])
def get_favorite_albums(user_id: int):
    favorite_albums = user_model.get_favorite_albums(user_id)
    if not favorite_albums:
        raise HTTPException(status_code=404, detail="No se encontraron álbumes favoritos.")
    return favorite_albums

@router.get("/{user_id}/favorite-songs", response_model=list[SongDTO])
def get_favorite_songs(user_id: int):
    favorite_songs = user_model.get_favorite_songs(user_id)
    if not favorite_songs:
        raise HTTPException(status_code=404, detail="No se encontraron canciones favoritas.")
    return favorite_songs

@router.get("/{user_id}/orders", response_model=list[OrderDTO])
def get_orders(user_id: int):
    orders = user_model.get_orders(user_id)
    if not orders:
        raise HTTPException(status_code=404, detail="No se encontraron pedidos.")
    return orders
