import os, json
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()

base_llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.2",
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
    provider="auto",
    temperature=0.0,
    max_new_tokens=120,
)

chat = ChatHuggingFace(llm=base_llm)


def get_sentiment(text):
    msgs = [
        SystemMessage(
            content="""Eres un asistente de soporte al cliente. Tu tarea es clasificar el texto del ticket.
Devuelve SOLO un JSON válido (sin texto adicional, sin markdown, sin explicación).

El JSON debe contener EXACTAMENTE estas dos claves:
- "sentiment": uno de ["Positivo", "Negativo", "Neutral"]
- "category": uno de ["Facturación", "Técnico", "Comercial", "Otro"]

Reglas del category:
- Técnico: fallas, errores, acceso/login, bugs, rendimiento, caídas, integraciones, problemas técnicos.
- Facturación: cobros, pagos, facturas, reembolsos, suscripciones, renovaciones, tarjetas.
- Comercial: precios, planes, demo, compra, ventas, información comercial, cotizaciones.
- Otro: si no encaja claramente en las anteriores.

Reglas de sentiment:
- Negativo: enojo, frustración, queja, urgencia fuerte, amenaza de cancelar, lenguaje agresivo.
- Positivo: agradece, felicita, expresa interés o satisfacción.
- Neutral: solicitud informativa o sin emoción marcada.

Formato obligatorio del output (ejemplo):
{"category":"Técnico","sentiment":"Negativo"}"""
        ),
        HumanMessage(content=f"Ticket:\n{text}"),
    ]
    raw = chat.invoke(msgs).content.strip()
    print("Raw response:", raw)
    # parse robusto
    a, b = raw.find("{"), raw.rfind("}")
    res= json.loads(raw[a : b + 1]) if a != -1 and b != -1 else json.loads(raw)
    if "category" not in res or "sentiment" not in res:
        raise ValueError("Respuesta del LLM no contiene las claves requeridas.")
    return res