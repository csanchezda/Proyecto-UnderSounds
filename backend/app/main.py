from fastapi import FastAPI
from app.controllers import user_controller, artist_controller, test_connection_db_controller, shopping_cart_controller, payment_controller, order_controller
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi




app = FastAPI(title="UnderSounds API",
    description="API para usuarios, artistas, canciones y más",
    version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).resolve().parent.parent / "data"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# Routers
app.include_router(user_controller.router)
app.include_router(artist_controller.router)
app.include_router(shopping_cart_controller.router)
app.include_router(payment_controller.router)
app.include_router(test_connection_db_controller.router)
app.include_router(order_controller.router)

bearer_scheme = HTTPBearer()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    for path in openapi_schema["paths"].values():
        for operation in path.values():
            operation["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi



@app.get("/")
def root():
    return {"message": "API de UnderSounds funcionando correctamente"}