import firebase_admin
from firebase_admin import credentials, auth

if not firebase_admin._apps:
    cred = credentials.Certificate("data/credentials.json")
    firebase_admin.initialize_app(cred)

def verify_id_token(id_token: str):
    return auth.verify_id_token(id_token)
