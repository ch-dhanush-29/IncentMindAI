import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.repositories.incident_repo import incident_repo
from app.core.seed import seed_realistic_incidents
from app.api.incidents import router as incidents_router
from app.api.memory import router as memory_router
from app.api.analytics import router as analytics_router
from app.api.system import router as system_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("incidentmind")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing IncidentMind AI backend...")
    await incident_repo.connect()
    if settings.DEMO_MODE:
        await seed_realistic_incidents()
    yield
    logger.info("Shutting down IncidentMind AI backend...")

app = FastAPI(
    title="IncidentMind AI - Persistent Memory Incident Response API",
    description="Agentic incident response copilot leveraging Vectorize Hindsight memory for verified root cause recall and remediation assistance.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents_router, prefix=settings.API_V1_PREFIX)
app.include_router(memory_router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics_router, prefix=settings.API_V1_PREFIX)
app.include_router(system_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "name": "IncidentMind AI API",
        "description": "Persistent memory incident response agent powered by Hindsight and Groq",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
