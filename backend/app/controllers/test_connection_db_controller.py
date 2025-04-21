from fastapi import APIRouter
from sqlalchemy import text
from app.db.database import db_session

router = APIRouter()

@router.get("/test-db", tags=["Test"])
def test_database_connection():
    try:
        db = next(db_session())
        db.execute(text("SELECT 1"))
        return {
            "status": "success",
            "message": "✅ Conexión exitosa con PostgreSQL"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"❌ Error al conectar con la base de datos: {str(e)}"
        }
