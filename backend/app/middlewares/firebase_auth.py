from fastapi import Depends, HTTPException, Header
from app.utils.firebase_admin import verify_id_token
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory

async def firebase_auth(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")

    id_token = authorization.split(" ")[1]

    try:
        decoded_token = verify_id_token(id_token)
        email = decoded_token.get("email")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user_model = User(PostgresFactory())
    user = user_model.get_user_by_email(email)

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return user
