from fastapi import Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.firebase_admin import verify_id_token
from app.models.user import User
from app.factories.postgres_factory import PostgresFactory

auth_scheme = HTTPBearer()

async def firebase_auth(
    credentials: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    token = credentials.credentials

    try:
        decoded_token = verify_id_token(token)
        email = decoded_token.get("email")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_model = User(PostgresFactory())
    user = user_model.get_user_by_email(email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
