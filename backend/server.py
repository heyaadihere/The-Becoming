from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import requests as http_requests

try:
    import resend
    RESEND_AVAILABLE = True
except ImportError:
    RESEND_AVAILABLE = False

try:
    from twilio.rest import Client as TwilioClient
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RESEND_TEMPLATE_ID = '4313defa-edad-4ba3-8592-b2b98fa91d64'
CC_EMAIL = 'updates@enteryourbecoming.com'

# Twilio setup
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_VERIFY_SERVICE = os.environ.get('TWILIO_VERIFY_SERVICE')
twilio_client = None
if TWILIO_AVAILABLE and TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    twilio_client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# MSG91 setup
MSG91_AUTH_KEY = os.environ.get('MSG91_AUTH_KEY')
MSG91_TEMPLATE_ID = os.environ.get('MSG91_TEMPLATE_ID')

if RESEND_AVAILABLE and RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

async def send_confirmation_email(to_email, name, form_type="signup"):
    """Send confirmation email to form submitter with CC to team"""
    if not (RESEND_AVAILABLE and RESEND_API_KEY):
        logger.warning("Resend not configured, skipping email")
        return
    
    try:
        if form_type == "signup":
            # Use the Resend template for signup confirmations
            params = {
                "from": SENDER_EMAIL,
                "to": [to_email],
                "cc": [CC_EMAIL],
                "reply_to": ["updates@enteryourbecoming.com"],
                "subject": "You\u2019ve Entered The Becoming!",
                "html": """<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  </head>
  <body>
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0" data-skip-in-text="true">
      You're in! Next steps coming soon for Mountain Sunrise Chapter
    </div>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
              style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;font-size:1.08em;min-height:100%;line-height:155%">
              <tbody>
                <tr>
                  <td>
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
                      style="align:left;width:100%;padding-left:0px;padding-right:0px;line-height:155%;max-width:600px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif">
                      <tbody>
                        <tr>
                          <td>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>Hey, You\u2019re in!</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>You\u2019ve just taken the first step toward The Becoming - Mountain Sunrise Chapter, a premium human experience &amp; experiential learning journey for 21 individuals, set in the lap of the Himalayas.</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>Our team is reviewing applications now. Next steps within 24 hours.</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>Something beautiful has already begun!</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>-Team The Becoming</span>
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>"""
            }
        else:
            # Contact form - simple acknowledgment
            params = {
                "from": SENDER_EMAIL,
                "to": [to_email],
                "cc": [CC_EMAIL],
                "reply_to": ["updates@enteryourbecoming.com"],
                "subject": "We received your message - The Becoming",
                "html": """<!DOCTYPE html>
<html><body>
<table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
  <tbody><tr><td>
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
      style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;font-size:1.08em;min-height:100%;line-height:155%">
      <tbody><tr><td>
        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:600px;line-height:155%">
          <tbody><tr><td>
            <p style="margin:0;padding:0.5em 0;font-size:1em"><span>Hello """ + f"{name}" + """,</span></p>
            <p style="margin:0;padding:0.5em 0;font-size:1em"><span>Thank you for reaching out to us. We've received your message and will get back to you shortly.</span></p>
            <p style="margin:0;padding:0.5em 0;font-size:1em"><span>We appreciate your interest in The Becoming.</span></p>
            <p style="margin:0;padding:0.5em 0;font-size:1em"><span>-Team The Becoming</span></p>
          </td></tr></tbody>
        </table>
      </td></tr></tbody>
    </table>
  </td></tr></tbody>
</table>
</body></html>"""
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

class OTPSendRequest(BaseModel):
    phone_number: str

class OTPVerifyRequest(BaseModel):
    phone_number: str
    code: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "The Becoming API"}

@api_router.post("/send-otp")
async def send_otp(request: OTPSendRequest):
    if not MSG91_AUTH_KEY:
        raise HTTPException(status_code=500, detail="SMS service not configured")
    try:
        # Strip + prefix, MSG91 expects plain number with country code
        mobile = request.phone_number.replace("+", "").strip()
        url = "https://control.msg91.com/api/v5/otp"
        params = {"template_id": MSG91_TEMPLATE_ID, "mobile": mobile, "authkey": MSG91_AUTH_KEY, "otp_length": "6"}
        headers = {"Content-Type": "application/json"}
        resp = await asyncio.to_thread(http_requests.post, url, params=params, headers=headers)
        data = resp.json()
        logger.info(f"MSG91 send OTP response for {mobile}: {data}")
        if data.get("type") == "success":
            return {"status": "pending"}
        raise HTTPException(status_code=400, detail=data.get("message", "Failed to send OTP"))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to send OTP to {request.phone_number}: {str(e)}")
        raise HTTPException(status_code=400, detail="Failed to send OTP. Please check the phone number and try again.")

@api_router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest):
    if not MSG91_AUTH_KEY:
        raise HTTPException(status_code=500, detail="SMS service not configured")
    try:
        mobile = request.phone_number.replace("+", "").strip()
        url = "https://control.msg91.com/api/v5/otp/verify"
        params = {"mobile": mobile, "otp": request.code, "authkey": MSG91_AUTH_KEY}
        resp = await asyncio.to_thread(http_requests.get, url, params=params)
        data = resp.json()
        logger.info(f"MSG91 verify OTP response for {mobile}: {data}")
        return {"valid": data.get("type") == "success"}
    except Exception as e:
        logger.error(f"Failed to verify OTP for {request.phone_number}: {str(e)}")
        raise HTTPException(status_code=400, detail="Verification failed. Please try again.")

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

# Serve React frontend build for SPA routing
FRONTEND_BUILD = Path(__file__).parent.parent / 'frontend' / 'build'

if FRONTEND_BUILD.exists() and (FRONTEND_BUILD / "static").exists():
    # Serve static files (JS, CSS, images)
    app.mount("/static", StaticFiles(directory=str(FRONTEND_BUILD / "static")), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Catch-all route to serve React SPA for client-side routing"""
        # Try to serve the exact file if it exists (e.g., favicon.ico, images)
        file_path = FRONTEND_BUILD / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        # Otherwise serve index.html for React Router
        return FileResponse(str(FRONTEND_BUILD / "index.html"))
