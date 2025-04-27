from fastapi import APIRouter, HTTPException, Body
import requests

router = APIRouter(prefix="/payment", tags=["Payment"])

PAYPAL_SANDBOX_API = "https://api-m.sandbox.paypal.com"
CLIENT_ID = "ATTjdo6mgfmzEypsgIOecZxo7ysBXOlTsGgAG4If7CAjra1iNJbDDlwDoqP5oOQq1dYb14GdAbLVvfgK"
CLIENT_SECRET = "EEW5PhlYi-A6CNaZfoZkLCRaXFnkyjOCNf4loQUwcYHbAGNiHcjvY61ZzSv9zTG8QGTUY7cqqd-s9edz"

@router.post("/process")
def process_payment(payload: dict = Body(...)):
    amount = payload.get("amount")
    if amount is None:
        raise HTTPException(status_code=400, detail="Amount is required")
    
    try:
        # 1. Obtener token
        response = requests.post(
            f"{PAYPAL_SANDBOX_API}/v1/oauth2/token",
            headers={
                "Accept": "application/json",
                "Accept-Language": "en_US"
            },
            auth=(CLIENT_ID, CLIENT_SECRET),
            data={"grant_type": "client_credentials"}
        )

        response.raise_for_status()
        access_token = response.json()["access_token"]

        # 2. Crear pago
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        data = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": "EUR",
                    "value": str(amount)
                }
            }]
        }

        payment_response = requests.post(
            f"{PAYPAL_SANDBOX_API}/v2/checkout/orders",
            headers=headers,
            json=data
        )

        payment_response.raise_for_status()

        return {"status": "success", "message": "Pago simulado en PayPal Sandbox."}

    except Exception as e:
        print(f"❌ Error en el pago simulado: {e}")
        raise HTTPException(status_code=500, detail="Error procesando pago.")
