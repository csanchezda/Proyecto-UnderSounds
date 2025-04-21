from fastapi import APIRouter
from sqlalchemy import text
from app.db.database import db_session

router = APIRouter()

@router.get("/test-db")
def test_database_connection():
    try:
        with db_session() as session:
            session.execute(text("SELECT 1"))
        return {
            "status": "success",
            "message": "✅ Conexión exitosa con PostgreSQL"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"❌ Error al conectar con la base de datos: {str(e)}"
        }
