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
    why_becoming: str
    current_state: str
    what_seeking: str
    questionnaire_data: Optional[str] = None
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"

class SignupSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    why_becoming: str
    current_state: str
    what_seeking: str
    questionnaire_data: Optional[str] = None

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

@api_router.post("/signup", response_model=SignupSubmission)
async def create_signup(input: SignupSubmissionCreate):
    """Submit interest form for The Becoming"""
    submission_dict = input.model_dump()
    submission_obj = SignupSubmission(**submission_dict)
    
    doc = submission_obj.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    
    await db.signup_submissions.insert_one(doc)
    
    # Send email notification if configured
    if RESEND_AVAILABLE and RESEND_API_KEY and NOTIFICATION_EMAIL:
        try:
            html_content = f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0c0c0c; color: #e5e5e5;">
                <h1 style="font-size: 28px; color: #d4a373; margin-bottom: 30px; font-weight: 400;">New Becoming Submission</h1>
                
                <div style="background-color: #161616; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #a3a3a3; margin: 0 0 8px 0; font-weight: 400;">Name</h2>
                    <p style="font-size: 18px; color: #e5e5e5; margin: 0;">{submission_obj.name}</p>
                </div>
                
                <div style="background-color: #161616; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #a3a3a3; margin: 0 0 8px 0; font-weight: 400;">Email</h2>
                    <p style="font-size: 18px; color: #e5e5e5; margin: 0;">{submission_obj.email}</p>
                </div>
                
                {f'''<div style="background-color: #161616; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #a3a3a3; margin: 0 0 8px 0; font-weight: 400;">Phone</h2>
                    <p style="font-size: 18px; color: #e5e5e5; margin: 0;">{submission_obj.phone}</p>
                </div>''' if submission_obj.phone else ''}
                
                <div style="background-color: #161616; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #a3a3a3; margin: 0 0 8px 0; font-weight: 400;">Why The Becoming?</h2>
                    <p style="font-size: 16px; color: #e5e5e5; margin: 0; line-height: 1.6;">{submission_obj.why_becoming}</p>
                </div>
                
                <div style="background-color: #161616; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #a3a3a3; margin: 0 0 8px 0; font-weight: 400;">Current State</h2>
                    <p style="font-size: 16px; color: #e5e5e5; margin: 0; line-height: 1.6;">{submission_obj.current_state}</p>
                </div>
                
                <div style="background-color: #161616; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #a3a3a3; margin: 0 0 8px 0; font-weight: 400;">What They're Seeking</h2>
                    <p style="font-size: 16px; color: #e5e5e5; margin: 0; line-height: 1.6;">{submission_obj.what_seeking}</p>
                </div>
                
                <p style="font-size: 12px; color: #525252; margin-top: 30px;">
                    Submitted at: {submission_obj.submitted_at.strftime('%Y-%m-%d %H:%M:%S UTC')}
                </p>
            </div>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [NOTIFICATION_EMAIL],
                "subject": f"New Becoming Submission: {submission_obj.name}",
                "html": html_content
            }
            
            await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Email notification sent for submission: {submission_obj.id}")
        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}")
    
    return submission_obj

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
