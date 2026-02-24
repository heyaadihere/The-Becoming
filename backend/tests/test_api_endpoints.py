"""
Backend API Tests for 'The Becoming' Landing Page
Tests /api/signup and /api/contact endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAPIRoot:
    """Test base API endpoint"""
    
    def test_api_root_returns_200(self):
        """Test that API root responds with 200"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ API root returns: {data}")


class TestSignupEndpoint:
    """Test /api/signup endpoint for questionnaire submissions"""
    
    def test_signup_success_with_all_fields(self):
        """Test signup with all required fields"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "Test User",
            "email": unique_email,
            "phone": "+1234567890",
            "alt_phone": "+0987654321",
            "social_media": "Instagram: @testuser",
            "questionnaire_data": '{"whatBringsYou": "Seeking clarity"}'
        }
        response = requests.post(f"{BASE_URL}/api/signup", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data, "Response should contain id"
        assert data["name"] == "Test User"
        assert data["email"] == unique_email
        assert data["status"] == "pending"
        assert "message" in data
        print(f"✓ Signup success: {data}")

    def test_signup_with_minimum_required_fields(self):
        """Test signup with minimum required fields (name, email)"""
        unique_email = f"minimal_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "Minimal User",
            "email": unique_email
        }
        response = requests.post(f"{BASE_URL}/api/signup", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        assert data["name"] == "Minimal User"
        print(f"✓ Minimal signup success: {data}")

    def test_signup_invalid_email_fails(self):
        """Test signup with invalid email format should fail"""
        payload = {
            "name": "Invalid Email User",
            "email": "not-an-email"
        }
        response = requests.post(f"{BASE_URL}/api/signup", json=payload)
        # Should return 422 for validation error
        assert response.status_code == 422, f"Expected 422, got {response.status_code}: {response.text}"
        print(f"✓ Invalid email rejected with status {response.status_code}")

    def test_signup_missing_name_fails(self):
        """Test signup without name should fail"""
        payload = {
            "email": "noname@example.com"
        }
        response = requests.post(f"{BASE_URL}/api/signup", json=payload)
        # Should return 422 for missing required field
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Missing name rejected with status {response.status_code}")


class TestContactEndpoint:
    """Test /api/contact endpoint for contact form submissions"""
    
    def test_contact_success_with_all_fields(self):
        """Test contact form with all fields"""
        unique_email = f"contact_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "Contact Test User",
            "email": unique_email,
            "phone": "+1234567890",
            "message": "This is a test message from automated testing."
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data, "Response should contain id"
        assert "message" in data
        print(f"✓ Contact form success: {data}")

    def test_contact_without_name(self):
        """Test contact form without name (name is optional)"""
        unique_email = f"noname_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "email": unique_email,
            "phone": "+1234567890",
            "message": "Test message without name"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        print(f"✓ Contact without name success: {data}")

    def test_contact_missing_email_fails(self):
        """Test contact form without email should fail"""
        payload = {
            "name": "No Email User",
            "phone": "+1234567890",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Missing email rejected with status {response.status_code}")

    def test_contact_missing_phone_fails(self):
        """Test contact form without phone should fail"""
        payload = {
            "name": "No Phone User",
            "email": "nophone@example.com",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Missing phone rejected with status {response.status_code}")

    def test_contact_missing_message_fails(self):
        """Test contact form without message should fail"""
        payload = {
            "name": "No Message User",
            "email": "nomessage@example.com",
            "phone": "+1234567890"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Missing message rejected with status {response.status_code}")

    def test_contact_invalid_email_fails(self):
        """Test contact form with invalid email should fail"""
        payload = {
            "name": "Invalid Email",
            "email": "not-valid-email",
            "phone": "+1234567890",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Invalid email rejected with status {response.status_code}")


class TestSignupsListEndpoint:
    """Test /api/signups endpoint for listing submissions"""
    
    def test_get_signups_returns_list(self):
        """Test that signups endpoint returns a list"""
        response = requests.get(f"{BASE_URL}/api/signups")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ Signups list returns {len(data)} items")


class TestStatusEndpoint:
    """Test /api/status endpoint"""
    
    def test_status_post(self):
        """Test status check POST"""
        payload = {"client_name": "test_client"}
        response = requests.post(f"{BASE_URL}/api/status", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        assert data["client_name"] == "test_client"
        print(f"✓ Status POST success: {data}")

    def test_status_get(self):
        """Test status check GET"""
        response = requests.get(f"{BASE_URL}/api/status")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Status GET returns {len(data)} items")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
