from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from models import LeadCreate, Lead
from storage import storage
import logging
import time

# Configuração de Logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("server.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="VIPNEXUS IA Backend",
    description="API de Captura de Leads (Python/FastAPI)",
    version="1.0.0"
)

# Configuração CORS
origins = [
    "https://captura.vipnexusia.com.br",
    "http://localhost:5173",
    "http://localhost:3000",
    "*" # Temporário para testes, remover em prod estrito se necessário
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
    return response

@app.get("/")
async def health_check():
    return {
        "status": "online",
        "message": "Backend Python operacional.",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S%z")
    }

@app.post("/leads", response_model=Lead, status_code=status.HTTP_201_CREATED)
async def create_lead(lead: LeadCreate, request: Request):
    try:
        logger.info(f"Recebendo novo lead: {lead.email}")
        
        # Extrair IP (tenta pegar do header x-forwarded-for se estiver atrás de proxy)
        client_ip = request.headers.get("x-forwarded-for", request.client.host)
        
        lead_data = lead.model_dump()
        lead_data["ip"] = client_ip
        
        new_lead = storage.create_lead(lead_data)
        
        logger.info(f"Lead salvo com sucesso: {new_lead['id']}")
        return new_lead
        
    except Exception as e:
        logger.error(f"Erro ao salvar lead: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao processar lead"
        )

@app.get("/leads")
async def list_leads():
    try:
        return {"leads": storage.get_leads()}
    except Exception as e:
        logger.error(f"Erro ao listar leads: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao recuperar dados")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=10000, reload=True)
