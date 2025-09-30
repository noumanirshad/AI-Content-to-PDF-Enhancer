#!/usr/bin/env python3
"""
Quick test script to verify Gemini API configuration
"""

import requests
import json
import sys

def test_gemini_api(api_key):
    """Test Gemini API with correct endpoints"""
    
    print("🧪 Testing Gemini API Configuration...")
    print("=" * 50)
    
    # Test 1: List available models
    print("1. Testing model listing...")
    try:
        response = requests.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}")
        if response.ok:
            models = response.json().get('models', [])
            model_names = [m['name'] for m in models if 'gemini' in m['name'].lower()]
            print(f"   ✅ Found {len(model_names)} Gemini models:")
            for model in model_names[:5]:  # Show first 5
                print(f"      - {model}")
        else:
            print(f"   ❌ Failed to list models: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error listing models: {e}")
        return False
    
    # Test 2: Test gemini-2.5-flash
    print("\n2. Testing gemini-2.5-flash...")
    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}",
            headers={'Content-Type': 'application/json'},
            json={
                "contents": [{
                    "parts": [{"text": "Say hello in one word"}]
                }],
                "generationConfig": {
                    "maxOutputTokens": 10
                }
            }
        )
        
        if response.ok:
            data = response.json()
            text = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            print(f"   ✅ gemini-2.5-flash works! Response: {text}")
        else:
            error_data = response.json()
            print(f"   ❌ gemini-2.5-flash failed: {error_data.get('error', {}).get('message', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"   ❌ Error testing gemini-2.5-flash: {e}")
        return False
    
    # Test 3: Test gemini-2.5-pro
    print("\n3. Testing gemini-2.5-pro...")
    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={api_key}",
            headers={'Content-Type': 'application/json'},
            json={
                "contents": [{
                    "parts": [{"text": "Say hello in one word"}]
                }],
                "generationConfig": {
                    "maxOutputTokens": 10
                }
            }
        )
        
        if response.ok:
            data = response.json()
            text = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            print(f"   ✅ gemini-2.5-pro works! Response: {text}")
        else:
            error_data = response.json()
            print(f"   ❌ gemini-2.5-pro failed: {error_data.get('error', {}).get('message', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"   ❌ Error testing gemini-2.5-pro: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 All tests passed! Your API key is working correctly.")
    print("\n📋 Next steps:")
    print("1. Load the Chrome extension")
    print("2. Enter your API key in settings")
    print("3. Test the extension on any webpage")
    
    return True

def main():
    if len(sys.argv) != 2:
        print("Usage: python test_gemini_api.py <your_api_key>")
        print("Get your API key from: https://makersuite.google.com/app/apikey")
        sys.exit(1)
    
    api_key = sys.argv[1]
    
    if not api_key.startswith('AIza'):
        print("❌ Invalid API key format. Should start with 'AIza'")
        sys.exit(1)
    
    success = test_gemini_api(api_key)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
