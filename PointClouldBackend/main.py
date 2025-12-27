# backend/main.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()  # loads .env in backend/ if you want

app = FastAPI(title="My Next + FastAPI backend")

# Configure CORS (in dev allow localhost:3000)
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000")
origins = [o.strip() for o in CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],  # dev: set to specific domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str
    price: float

@app.get("/info")
async def get_info():
    return {"status": "ok", "message": "Welcome to Twinx Point Cloud Backend", "source": "Hipx"}

# small health-check
@app.get("/health")
async def health():
    return {"status": "healthy"}



# to start -

# 0. cd backend
# 1. if you are on Windows, run the following command to activate the virtual environment:
#    - For PowerShell: `.venv\Scripts\Activate.ps1`
#    - For Command Prompt: `.venv\Scripts\activate.bat`
# 2. install dependencies: `pip install -r requirements.txt`
# 3. run the server: `uvicorn main:app --reload`