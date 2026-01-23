# Vivetori – Prueba Técnica (Full-Stack AI Engineer)

Este repositorio contiene una solución full-stack para un flujo de **tickets de soporte**, con:

- **Frontend**: Vite + React 18 + TypeScript + Tailwind (modo oscuro), consumiendo **Supabase directamente** para listar tickets y usando **Realtime Channels** para ver cambios sin refrescar.
- **Backend**: FastAPI (Python) con endpoints mínimos para crear y consultar tickets (persistencia en Supabase). La integración con LLM puede vivir aquí (según la guía), pero el frontend no depende de ella para Realtime.
- **Webhooks en Supabase**: al insertar tickets se dispara un webhook HTTP a un servidor n8n.
- **Notificaciones**: **NO** se implementó envío de correo; en su lugar y para mejor visualizacion a cualquier persona de esta prueba se utilizó **ntfy** para visualizar rápidamente los payloads del webhook.
---

## Links actuales

- **Frontend (Vercel)**: https://vivetori-prueba-frontend.vercel.app
- **ntfy (topic de pruebas)**: https://ntfy.sh/carual-vivetori
- **Backend (FastAPI)**: https://vivetori-prueba-tec.vercel.app
- **Servidor n8n** se usa un servidor propio de n8n, se puede cambiar todo esto en los .env
---

## Arquitectura (alto nivel)

1. El **frontend** lista tickets desde **Supabase** y se suscribe a `postgres_changes` vía **Realtime**.
2. En el **frontend** se crea tickets con el botón y este llama al **backend (FastAPI)** con un `POST`.
3. El **backend** inserta el ticket en **Supabase**.
4. **Supabase** Envía una alerta al webhook en **n8n**
5. **n8n** recibe el ticket y envía una solicitud de procesar el ticket en el **backend**
6. El **backend** envía la consulta a huggingFace para que una IA proporcione la categoría y el sentiment de el ticket
7. el **backend** recibe la respuesta y actualiza los datos del ticket, hace que processed=true y lo actualiza en  y devuelve el ticket
8. Cuando **n8n** recibe la respuesta revisa si es Negativo y si es negativo lo envía a **ntfy**
9. Al insertarse en la BD:
   - El frontend recibe el evento **INSERT** por Realtime y actualiza la UI sin recargar.

---

## Estructura del proyecto

- `frontend/`  
  Vite + React + Tailwind + Supabase client.  
- `python-api/`  
  FastAPI + conexión a Supabase.
- `supabase/`  
  SQL para la creación de la base de datos (hay que activar la funcion de webhook dentro de supabase), junto con la funcion de webhooks de postgre y la posibilidad de realtime con la base de datos
- `n8n-workflow/`  
  json del workflow creado en n8n
---

## Base de datos (Supabase)

### Tabla principal
- `public.tickets`

Campos típicos (referenciales):
- `id` (uuid)
- `created_at` (timestamp)
- `description` (text)
- `processed` (boolean)
- `category` (text nullable)
- `sentiment` (text nullable)


---

## Aviso (ntfy)
Para pruebas, se configuró una respuesta de enviar el mensaje a en vez del correo para facilidad de visualización:
- `https://ntfy.sh/Carual`
### Nota importante
No se implementó el envío del correo. Se prefirió usa **ntfy** para poder visualizar facilmente publicamente, el correo habría tenido limitaciones que en un ambiente de producción no se tendrían
## Backend (FastAPI)
### Endpoints implentados
`GET /ticket` Devuelve todos los tickets max 200
#### Response
```json
[{
  "id": "...",
  "created_at": "...",
  "description": "...",
  "processed": false,
  "category": null,
  "sentiment": null
},{
  "id": "...",
  "created_at": "...",
  "description": "...",
  "processed": false,
  "category": null,
  "sentiment": null
}]
```

`POST /ticket` Crea un ticket Nuevo
#### Body
```json
{
  "description": "Texto del ticket"
}
```
#### Response
```json
{
  "id": "...",
  "created_at": "...",
  "description": "Texto del ticket",
  "processed": false,
  "category": null,
  "sentiment": null
}
```
`POST /process-ticket/{ticket_id}`Procesa el ticket
#### Response
```json
{
  "id": "...",
  "created_at": "...",
  "description": "...",
  "processed": true,
  "category": "...",
  "sentiment": "..."
}
```
#### Nota
- En un porcentaje muy casos el api de de AI puede dar sentiments no correctos, esto esta limitado por ser un api y un AI de bajo nivel de 7B
## Frontend (Vite + React + Tailwind)
## Funcionalidades
- Lista de tickets (lectura directa desde Supabase)
- Realtime: los tickets aparecen/actualizan/eliminan sin refrescar
- Botón para crear ticket llamando al API (POST /ticket)
## Variables de Entorno
### FrontEnd (`frontend/.env`)
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_BASE_URL=https://vivetori-prueba-tec.vercel.app
```
### Backend (`python-api/.env`)
```env
SUPABASE_URL=...
SUPABASE_KEY=...
HUGGINGFACEHUB_API_TOKEN=...
HF_MODEL_ID=mistralai/Mistral-7B-Instruct-v0.2
FRONT_END_URL=https://vivetori-prueba-frontend.vercel.app
```