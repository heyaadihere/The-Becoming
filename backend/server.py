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
CC_EMAIL = 'updates@enterthebecoming.com'

if RESEND_AVAILABLE and RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

async def send_confirmation_email(to_email, name, form_type="signup"):
    """Send confirmation email to form submitter with CC to team"""
    if not (RESEND_AVAILABLE and RESEND_API_KEY):
        logger.warning("Resend not configured, skipping email")
        return
    
    if form_type == "signup":
        subject = "Welcome to The Becoming"
        html = f"""
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAF8F5;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2D2926; font-size: 28px; margin: 0;">The Becoming</h1>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #E8DFD5;">
                <h2 style="color: #2D2926; font-size: 22px;">Hello {name},</h2>
                <p style="color: #4A4543; line-height: 1.8; font-size: 16px;">
                    Thank you for taking this step towards your Becoming.
                </p>
                <p style="color: #4A4543; line-height: 1.8; font-size: 16px;">
                    We've received your response and a Becoming bud will be reaching out to you soon to discuss the next steps of your journey.
                </p>
                <p style="color: #4A4543; line-height: 1.8; font-size: 16px;">
                    In the meantime, know that something beautiful is about to begin.
                </p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E8DFD5;">
                    <p style="color: #C9A962; font-style: italic; font-size: 16px;">
                        "Because becoming should feel less like pressure, and more like coming alive."
                    </p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #4A4543; font-size: 13px;">With warmth,<br><strong>The Becoming Team</strong></p>
                <p style="color: #B8956A; font-size: 12px;">enter@thebecoming.in</p>
            </div>
        </div>
        """
    else:
        subject = "We received your message - The Becoming"
        html = f"""
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAF8F5;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2D2926; font-size: 28px; margin: 0;">The Becoming</h1>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #E8DFD5;">
                <h2 style="color: #2D2926; font-size: 22px;">Hello {name},</h2>
                <p style="color: #4A4543; line-height: 1.8; font-size: 16px;">
                    Thank you for reaching out to us. We've received your message and will get back to you shortly.
                </p>
                <p style="color: #4A4543; line-height: 1.8; font-size: 16px;">
                    We appreciate your interest in The Becoming.
                </p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #4A4543; font-size: 13px;">With warmth,<br><strong>The Becoming Team</strong></p>
                <p style="color: #B8956A; font-size: 12px;">enter@thebecoming.in</p>
            </div>
        </div>
        """
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [to_email],
            "cc": [CC_EMAIL],
            "subject": subject,
            "html": html
        }
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to_email}, cc: {CC_EMAIL}, id: {email.get('id')}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")

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
        "status": "completed"
    }
    
    await db.signup_submissions.insert_one(submission)
    
    # Remove from partial submissions since form is complete
    if input.phone:
        await db.partial_submissions.delete_many({"phone": input.phone})
    
    # Send confirmation email (non-blocking)
    if input.email:
        asyncio.create_task(send_confirmation_email(input.email, input.name, "signup"))
    
    # Return without _id
    return {
        "id": submission_id,
        "name": input.name,
        "email": input.email,
        "phone": input.phone,
        "status": "completed",
        "message": "Submission received successfully"
    }

class PartialSignup(BaseModel):
    phone: str
    name: str = ""
    last_step: str = ""
    answers: str = ""

@api_router.post("/partial-signup")
async def save_partial_signup(input: PartialSignup):
    """Save partial form data for users who leave midway"""
    await db.partial_submissions.update_one(
        {"phone": input.phone},
        {"$set": {
            "phone": input.phone,
            "name": input.name,
            "last_step": input.last_step,
            "answers": input.answers,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "whatsapp_message": "Hey. You didn't come this far to stop halfway.\nYour BECOMING journey is waiting.\nFinish your form.. let's move."
        }},
        upsert=True
    )
    return {"message": "Partial form saved"}

@api_router.get("/admin/partial-signups")
async def get_admin_partial_signups():
    """Get all partial/incomplete form submissions"""
    partials = await db.partial_submissions.find({}, {"_id": 0}).sort("updated_at", -1).to_list(1000)
    return partials

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
    
    # Send confirmation email (non-blocking)
    if input.email:
        asyncio.create_task(send_confirmation_email(input.email, input.name, "contact"))
    
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

@api_router.get("/admin/signups")
async def get_admin_signups():
    """Get all signup submissions for admin dashboard"""
    submissions = await db.signup_submissions.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    return submissions

@api_router.get("/admin/contacts")
async def get_admin_contacts():
    """Get all contact submissions for admin dashboard"""
    contacts = await db.contact_submissions.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    return contacts

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
