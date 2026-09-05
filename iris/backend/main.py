import os
import sys
from contextlib import asynccontextmanager

# Ensure backend root is on Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from api.routes import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    init_db()
    print("IRIS Database initialized successfully.")
    yield

# Also eagerly ensure DB tables are created
init_db()

app = FastAPI(
    title="IRIS — Intelligent Risk & Impersonation Shield",
    description="Cybersecurity platform analyzing suspicious UPI content: messages, URLs, QR codes, screenshots, and transactions.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for local Next.js / Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "system": "IRIS — Intelligent Risk & Impersonation Shield",
        "tagline": "Detect. Explain. Protect.",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
