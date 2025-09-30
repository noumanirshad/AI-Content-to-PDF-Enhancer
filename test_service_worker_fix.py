#!/usr/bin/env python3
"""
Test script to verify service worker fix
"""

import os
import json

def test_manifest_fix():
    """Test if manifest.json has been fixed"""
    print("🔍 Testing Manifest.json Fix...")
    print("=" * 50)
    
    manifest_path = "chrome-extension/manifest.json"
    if not os.path.exists(manifest_path):
        print(f"❌ {manifest_path} not found")
        return False
    
    with open(manifest_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for problematic module type
    if '"type": "module"' in content:
        print("   ❌ Module type still present - this will cause errors")
        return False
    else:
        print("   ✅ Module type removed")
    
    # Check for proper background configuration
    if '"service_worker": "background.js"' in content:
        print("   ✅ Service worker properly configured")
        return True
    else:
        print("   ❌ Service worker configuration missing")
        return False

def test_background_js_consolidation():
    """Test if background.js has been properly consolidated"""
    print("\n🔍 Testing Background.js Consolidation...")
    print("=" * 50)
    
    background_path = "chrome-extension/background.js"
    if not os.path.exists(background_path):
        print(f"❌ {background_path} not found")
        return False
    
    with open(background_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for problematic importScripts
    if 'importScripts(' in content:
        print("   ❌ importScripts still present - this will cause errors")
        return False
    else:
        print("   ✅ importScripts removed")
    
    # Check for key components
    components = [
        'class PDFGenerator',
        'class AIEnhancerBackground',
        'generatePDF',
        'enhanceContent',
        'callGeminiAI'
    ]
    
    missing_components = []
    for component in components:
        if component in content:
            print(f"   ✅ {component} found")
        else:
            print(f"   ❌ {component} missing")
            missing_components.append(component)
    
    if missing_components:
        print(f"\n❌ Missing components: {', '.join(missing_components)}")
        return False
    else:
        print(f"\n✅ All key components found")
        return True

def test_file_structure():
    """Test if file structure is correct"""
    print("\n🔍 Testing File Structure...")
    print("=" * 50)
    
    required_files = [
        'chrome-extension/manifest.json',
        'chrome-extension/background.js',
        'chrome-extension/popup.html',
        'chrome-extension/popup.js',
        'chrome-extension/content.js',
        'chrome-extension/settings.html',
        'chrome-extension/settings.js'
    ]
    
    missing_files = []
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ {file_path} - missing")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n❌ Missing files: {', '.join(missing_files)}")
        return False
    else:
        print(f"\n✅ All required files present")
        return True

def test_manifest_syntax():
    """Test if manifest.json has valid syntax"""
    print("\n🔍 Testing Manifest.json Syntax...")
    print("=" * 50)
    
    manifest_path = "chrome-extension/manifest.json"
    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
        
        # Check required fields
        required_fields = [
            'manifest_version',
            'name',
            'version',
            'description',
            'permissions',
            'background',
            'action',
            'icons'
        ]
        
        missing_fields = []
        for field in required_fields:
            if field in manifest:
                print(f"   ✅ {field}")
            else:
                print(f"   ❌ {field} - missing")
                missing_fields.append(field)
        
        if missing_fields:
            print(f"\n❌ Missing fields: {', '.join(missing_fields)}")
            return False
        else:
            print(f"\n✅ All required fields present")
            return True
            
    except json.JSONDecodeError as e:
        print(f"   ❌ Invalid JSON syntax: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Error reading manifest: {e}")
        return False

def main():
    print("🚀 Service Worker Fix Test Suite")
    print("=" * 60)
    
    tests = [
        test_manifest_fix,
        test_background_js_consolidation,
        test_file_structure,
        test_manifest_syntax
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Service worker fix is complete.")
        print("\n📋 Next steps:")
        print("1. Go to chrome://extensions/")
        print("2. Reload your extension")
        print("3. Should load without 'Service worker registration failed' error")
        print("4. Test the full functionality")
    else:
        print("❌ Some tests failed. Please check the issues above.")
        print("\n🔧 To fix:")
        print("1. Ensure manifest.json doesn't have 'type': 'module'")
        print("2. Verify background.js is consolidated")
        print("3. Check all required files are present")
        print("4. Validate manifest.json syntax")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
