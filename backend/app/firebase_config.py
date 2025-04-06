import firebase_admin
from firebase_admin import credentials, firestore

# Asegúrate de que la ruta sea correcta
cred = credentials.Certificate('firebase_key.json')
firebase_admin.initialize_app(cred)

# Obtener una instancia de Firestore
db = firestore.client()
