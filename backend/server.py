from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

try:
    import resend
    RESEND_AVAILABLE = True
except ImportError:
    RESEND_AVAILABLE = False

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL')

if RESEND_AVAILABLE and RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class SignupSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    alt_phone: Optional[str] = None
    social_media: Optional[str] = None
    questionnaire_data: Optional[str] = None
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"

class SignupSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    alt_phone: Optional[str] = None
    social_media: Optional[str] = None
    questionnaire_data: Optional[str] = None

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    email: EmailStr
    phone: str
    message: str
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    phone: str
    message: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "The Becoming API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/signup")
async def create_signup(input: SignupSubmissionCreate):
    """Submit interest form for The Becoming"""
    submission_id = str(uuid.uuid4())
    submission = {
        "id": submission_id,
        "name": input.name,
        "email": input.email,
        "phone": input.phone,
        "alt_phone": input.alt_phone,
        "social_media": input.social_media,
        "questionnaire_data": input.questionnaire_data,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "status": "pending"
    }
    
    await db.signup_submissions.insert_one(submission)
    
    # Return without _id
    return {
        "id": submission_id,
        "name": input.name,
        "email": input.email,
        "phone": input.phone,
        "status": "pending",
        "message": "Submission received successfully"
    }

@api_router.post("/contact")
async def create_contact(input: ContactSubmissionCreate):
    """Submit contact form"""
    contact_id = str(uuid.uuid4())
    contact = {
        "id": contact_id,
        "name": input.name,
        "email": input.email,
        "phone": input.phone,
        "message": input.message,
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.contact_submissions.insert_one(contact)
    
    return {
        "id": contact_id,
        "message": "Contact form submitted successfully"
    }

@api_router.get("/signups", response_model=List[SignupSubmission])
async def get_signups():
    """Get all signup submissions"""
    submissions = await db.signup_submissions.find({}, {"_id": 0}).to_list(1000)
    
    for sub in submissions:
        if isinstance(sub['submitted_at'], str):
            sub['submitted_at'] = datetime.fromisoformat(sub['submitted_at'])
    
    return submissions

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
