"""
Test suite for verifying the 10-step sign-up form (3 questions removed)
Tests that the form submission works with the new 10-question structure.

Questions in new form (10 total):
1. welcome (step 0)
2. name (step 1) 
3. phone (step 2)
4. whatBringsYou (step 3) - single select
5. currentPhase (step 4) - single select
6. readyFor (step 5) - textarea
7. investment (step 6) - single select
8. creativeExpression (step 7) - multi select
9. contact (step 8)
10. finalThought (step 9) - textarea

REMOVED questions (not in new form):
- seekingGrowth (was Q5)
- showUpAs (was Q7)
- timing (was Q8)
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL')

class Test10StepFormSubmission:
    """Test the 10-step form submission API"""
    
    def test_api_health(self):
        """Test that the API is accessible"""
        response = requests.get(f"{BASE_URL}/api/signups", 
                               auth=('admin', 'TheBecoming@2026'))
        assert response.status_code == 200
        print("✅ API health check passed")
    
    def test_submit_10step_form_data(self):
        """Test submitting form with new 10-question structure (removed 3 questions)"""
        unique_id = str(uuid.uuid4())[:8]
        
        # New 10-step form data structure (without seekingGrowth, showUpAs, timing)
        form_data = {
            "name": f"Test 10Step {unique_id}",
            "email": f"test10step_{unique_id}@example.com",
            "phone": "+919876543210",
            "alt_phone": "",
            "social_media": "Instagram: @test10step",
            "questionnaire_data": """{
                "name": "Test 10Step User",
                "email": "test10step@example.com",
                "phone": "+919876543210",
                "altPhone": "",
                "socialMedia": "Instagram",
                "socialHandle": "@test10step",
                "whatBringsYou": "Ready for personal growth",
                "currentPhase": "Ready for transformation",
                "readyFor": "Ready to embrace transformation and growth.",
                "investment": "₹1,75,000 – ₹2,25,000",
                "creativeExpression": ["Music", "Writing"],
                "finalThought": "Testing the 10-step form."
            }"""
        }
        
        response = requests.post(f"{BASE_URL}/api/signup", json=form_data)
        assert response.status_code == 200 or response.status_code == 201
        
        data = response.json()
        assert "id" in data or "success" in data
        print(f"✅ 10-step form submission successful")
        print(f"   Response: {data}")
    
    def test_form_data_without_removed_questions(self):
        """Verify form can be submitted without the removed questions (seekingGrowth, showUpAs, timing)"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Minimal form data - only the 10 required questions
        form_data = {
            "name": f"Minimal 10Step {unique_id}",
            "email": f"minimal10_{unique_id}@example.com",
            "phone": "+919876543210",
            "alt_phone": "",
            "social_media": "Instagram: @minimal",
            "questionnaire_data": """{
                "name": "Minimal User",
                "whatBringsYou": "Curious about self-discovery",
                "currentPhase": "Beginning a new chapter",
                "readyFor": "New experiences",
                "investment": "₹1,75,000 – ₹2,25,000",
                "creativeExpression": ["Photography"],
                "finalThought": "Excited!"
            }"""
        }
        
        response = requests.post(f"{BASE_URL}/api/signup", json=form_data)
        assert response.status_code == 200 or response.status_code == 201
        print(f"✅ Minimal 10-step form (without removed questions) submitted successfully")
    
    def test_verify_removed_questions_not_required(self):
        """Confirm that seekingGrowth, showUpAs, and timing are no longer required"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Form data explicitly without the removed fields
        form_data = {
            "name": f"No Removed Q {unique_id}",
            "email": f"noremoved_{unique_id}@example.com", 
            "phone": "+919876543210",
            "social_media": "LinkedIn: @test",
            "questionnaire_data": """{
                "name": "Test User",
                "whatBringsYou": "Seeking clarity",
                "currentPhase": "Growing",
                "readyFor": "Change",
                "investment": "₹1,75,000 – ₹2,25,000",
                "creativeExpression": ["Art"],
                "finalThought": "Looking forward!"
            }"""
        }
        # Note: seekingGrowth, showUpAs, timing are NOT included
        
        response = requests.post(f"{BASE_URL}/api/signup", json=form_data)
        assert response.status_code == 200 or response.status_code == 201
        
        print("✅ Form accepted without seekingGrowth, showUpAs, timing fields")
        print("   Confirming these questions have been successfully removed")
    
    def test_admin_can_view_submissions(self):
        """Test admin panel can view form submissions"""
        response = requests.get(f"{BASE_URL}/api/signups",
                               auth=('admin', 'TheBecoming@2026'))
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Admin can view {len(data)} submissions")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
