import os
from fastapi import FastAPI, HTTPException, Request
from dotenv import load_dotenv
from supabase import create_client
from llm import get_sentiment


load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Faltan SUPABASE_URL o SUPABASE_KEY en variables de entorno.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Tickets API", version="1.0.0")

@app.get("/")
async def root():
    return {"status": "ok", "message": "API de gestión de tickets funcionando."}

@app.post("/ticket")
async def create_ticket(request: Request):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Body inválido (no es JSON).")

    description = (body.get("description") or "").strip()
    if len(description) < 3:
        raise HTTPException(status_code=400, detail="description es requerido y debe tener al menos 3 caracteres.")

    try:
        res = supabase.table("tickets").insert({"description": description, "processed": False}).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="No se pudo crear el ticket.")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creando ticket: {str(e)}")

@app.post("/process-ticket/{ticket_id}")
def process_ticket(ticket_id: str):
    try:
        #get ticket
        ticket = supabase.table("tickets").select("*").eq("id", ticket_id).execute()
        if not ticket.data or len(ticket.data) == 0:
            raise HTTPException(status_code=404, detail="Ticket no encontrado.")
        ticket = ticket.data[0]
        if ticket["processed"]:
            raise HTTPException(status_code=400, detail="Ticket ya procesado.")
        get_sentiment_result = get_sentiment(ticket["description"])
        #update ticket
        print(ticket)
        res = supabase.table("tickets").update({"processed": True, "category": get_sentiment_result["category"], "sentiment": get_sentiment_result["sentiment"]}).eq("id", ticket_id).execute()
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando ticket: {str(e)}")

@app.get("/tickets")
def list_tickets():
    """
    Devuelve los tickets más recientes (por defecto 100).
    """
    try:
        res = (
            supabase.table("tickets")
            .select("*")
            .order("created_at", desc=True)
            .limit(100)
            .execute()
        )
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listando tickets: {str(e)}")
