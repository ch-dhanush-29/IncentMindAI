main_code = """import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
    logger.info("Initializing IncidentMind AI unified server...")
    await incident_repo.connect()
    if settings.DEMO_MODE:
        await seed_realistic_incidents()
    yield
    logger.info("Shutting down IncidentMind AI unified server...")

app = FastAPI(
    title="IncidentMind AI - Unified Incident Platform",
    description="Full-stack IncidentMind AI serving both API endpoints and React enterprise UI on a single unified port.",
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

# API Routes
app.include_router(incidents_router, prefix=settings.API_V1_PREFIX)
app.include_router(memory_router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics_router, prefix=settings.API_V1_PREFIX)
app.include_router(system_router, prefix=settings.API_V1_PREFIX)

# Static Frontend SPA Serving
frontend_dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(frontend_dist_dir):
    logger.info(f"Mounting frontend dist directory from {frontend_dist_dir}")
    assets_dir = os.path.join(frontend_dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path in ["docs", "openapi.json", "redoc"]:
            return
        file_path = os.path.join(frontend_dist_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist_dir, "index.html"))
else:
    logger.warning(f"Frontend dist not found at {frontend_dist_dir}. Serving API only.")

    @app.get("/")
    def root():
        return {
            "name": "IncidentMind AI API",
            "docs": "/docs",
            "health": "/api/health"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
"""

with open(r"d:\IncidentMind AI\backend\app\main.py", "w", encoding="utf-8") as f:
    f.write(main_code)

print("Updated backend/app/main.py successfully")
