#!/usr/bin/env python3
"""
Backend API Testing for Helibombas Dashboard System
Tests all API endpoints with comprehensive coverage
"""

import requests
import json
import sys
import io
from datetime import datetime
import time

class HelibombasAPITester:
    def __init__(self, base_url="https://data-visualizer-39.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def test_basic_endpoint(self):
        """Test GET /api/ - basic endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                expected_message = "Dashboard de Relatórios Helibombas - API"
                if data.get("message") == expected_message:
                    self.log_test("Basic API Endpoint", True)
                else:
                    self.log_test("Basic API Endpoint", False, f"Unexpected message: {data}")
            else:
                self.log_test("Basic API Endpoint", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Basic API Endpoint", False, f"Exception: {str(e)}")

    def test_meta_config_create(self):
        """Test POST /api/meta-config - create meta configuration"""
        try:
            test_meta_value = 2500000.0
            payload = {"meta_value": test_meta_value}
            
            response = requests.post(
                f"{self.api_url}/meta-config",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("meta_value") == test_meta_value and "id" in data:
                    self.log_test("Create Meta Config", True)
                    return data["id"]  # Return ID for potential cleanup
                else:
                    self.log_test("Create Meta Config", False, f"Invalid response data: {data}")
            else:
                self.log_test("Create Meta Config", False, f"Status code: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Create Meta Config", False, f"Exception: {str(e)}")
        
        return None

    def test_meta_config_get(self):
        """Test GET /api/meta-config - get current meta"""
        try:
            response = requests.get(f"{self.api_url}/meta-config", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if "meta_value" in data:
                    meta_value = data["meta_value"]
                    self.log_test("Get Meta Config", True, f"Current meta: R$ {meta_value:,.2f}")
                else:
                    self.log_test("Get Meta Config", False, f"Missing meta_value in response: {data}")
            else:
                self.log_test("Get Meta Config", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Meta Config", False, f"Exception: {str(e)}")

    def test_analyses_get(self):
        """Test GET /api/analyses - get all analyses"""
        try:
            response = requests.get(f"{self.api_url}/analyses", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Analyses", True, f"Found {len(data)} analyses")
                else:
                    self.log_test("Get Analyses", False, f"Expected list, got: {type(data)}")
            else:
                self.log_test("Get Analyses", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Analyses", False, f"Exception: {str(e)}")

    def test_upload_reports(self):
        """Test POST /api/upload-reports - simulate file upload"""
        try:
            # Create mock PDF content
            mock_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF"
            
            # Create mock Excel content (simple CSV-like content)
            mock_excel_content = b"PK\x03\x04\x14\x00\x00\x00\x08\x00"  # Basic Excel file header
            
            current_month = datetime.now().strftime("%m/%Y")
            
            files = {
                'report_530': ('report_530.pdf', io.BytesIO(mock_pdf_content), 'application/pdf'),
                'report_549': ('report_549.pdf', io.BytesIO(mock_pdf_content), 'application/pdf')
            }
            
            data = {
                'month_year': current_month
            }
            
            response = requests.post(
                f"{self.api_url}/upload-reports",
                files=files,
                data=data,
                timeout=30  # Longer timeout for file processing and AI analysis
            )
            
            success = response.status_code == 200
            
            if success:
                response_data = response.json()
                if "analysis_id" in response_data and "charts_data" in response_data:
                    self.log_test("Upload Reports", True, f"Analysis ID: {response_data['analysis_id']}")
                    return response_data["analysis_id"]
                else:
                    self.log_test("Upload Reports", False, f"Missing expected fields in response: {response_data}")
            else:
                self.log_test("Upload Reports", False, f"Status code: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Upload Reports", False, f"Exception: {str(e)}")
        
        return None

    def test_specific_analysis(self, analysis_id):
        """Test GET /api/analyses/{analysis_id} - get specific analysis"""
        if not analysis_id:
            self.log_test("Get Specific Analysis", False, "No analysis ID provided")
            return
            
        try:
            response = requests.get(f"{self.api_url}/analyses/{analysis_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if "id" in data and data["id"] == analysis_id:
                    self.log_test("Get Specific Analysis", True, f"Retrieved analysis: {analysis_id}")
                else:
                    self.log_test("Get Specific Analysis", False, f"ID mismatch or missing: {data}")
            else:
                self.log_test("Get Specific Analysis", False, f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Specific Analysis", False, f"Exception: {str(e)}")

    def test_cors_headers(self):
        """Test CORS configuration"""
        try:
            response = requests.options(f"{self.api_url}/", timeout=10)
            headers = response.headers
            
            cors_headers = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods',
                'Access-Control-Allow-Headers'
            ]
            
            cors_present = any(header in headers for header in cors_headers)
            
            if cors_present:
                self.log_test("CORS Configuration", True, "CORS headers present")
            else:
                self.log_test("CORS Configuration", False, "CORS headers missing")
                
        except Exception as e:
            self.log_test("CORS Configuration", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Helibombas Dashboard Backend API Tests")
        print(f"📍 Testing endpoint: {self.api_url}")
        print("=" * 60)
        
        # Test basic functionality first
        self.test_basic_endpoint()
        
        # Test meta configuration
        self.test_meta_config_get()
        meta_id = self.test_meta_config_create()
        
        # Test analyses
        self.test_analyses_get()
        
        # Test file upload (this might take longer due to AI processing)
        print("\n⏳ Testing file upload (may take 30+ seconds due to AI analysis)...")
        analysis_id = self.test_upload_reports()
        
        # Test specific analysis retrieval
        if analysis_id:
            time.sleep(2)  # Brief pause to ensure data is saved
            self.test_specific_analysis(analysis_id)
        
        # Test CORS
        self.test_cors_headers()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"✅ Tests Passed: {self.tests_passed}/{self.tests_run} ({success_rate:.1f}%)")
        
        if self.tests_passed < self.tests_run:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   • {result['name']}: {result['details']}")
        
        print("\n🎯 HELIBOMBAS SPECIFIC VALIDATIONS:")
        print("   • Default meta value should be R$ 2,200,000.00")
        print("   • API should handle PDF and Excel file uploads")
        print("   • AI analysis integration should be working")
        print("   • MongoDB persistence should be functional")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = HelibombasAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All backend tests passed!")
        return 0
    else:
        print("\n⚠️  Some backend tests failed. Check details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())