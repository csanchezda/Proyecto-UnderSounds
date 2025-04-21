from fastapi import FastAPI
from app.controllers import user_controller, artist_controller, test_connection_db_controller

app = FastAPI()

# Routers
app.include_router(user_controller.router)
app.include_router(artist_controller.router)
app.include_router(test_connection_db_controller.router)