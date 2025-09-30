#!/usr/bin/env python3
"""
Test script to verify PDF generation functionality
"""

import os
import json

def test_pdf_generator_file():
    """Test if PDF generator file exists and is valid"""
    print("🧪 Testing PDF Generation Files...")
    print("=" * 50)
    
    # Check if PDF generator file exists
    pdf_generator_path = "chrome-extension/pdf-generator.js"
    if os.path.exists(pdf_generator_path):
        print(f"✅ {pdf_generator_path} exists")
        
        # Check file size
        file_size = os.path.getsize(pdf_generator_path)
        print(f"   📏 File size: {file_size} bytes")
        
        # Check for key components
        with open(pdf_generator_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        key_components = [
            'class PDFGenerator',
            'generatePDF',
            'createPDFTemplate',
            'generatePDFData',
            'escapeHtml',
            'formatContentForPDF'
        ]
        
        missing_components = []
        for component in key_components:
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
    else:
        print(f"❌ {pdf_generator_path} not found")
        return False

def test_background_js_updates():
    """Test if background.js has been updated correctly"""
    print("\n🔍 Testing Background.js Updates...")
    print("=" * 50)
    
    background_path = "chrome-extension/background.js"
    if not os.path.exists(background_path):
        print(f"❌ {background_path} not found")
        return False
    
    with open(background_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for key updates
    updates = [
        'importScripts(\'pdf-generator.js\')',
        'this.pdfGenerator = new PDFGenerator()',
        'return await this.pdfGenerator.generatePDF'
    ]
    
    missing_updates = []
    for update in updates:
        if update in content:
            print(f"   ✅ {update}")
        else:
            print(f"   ❌ {update} - missing")
            missing_updates.append(update)
    
    # Check for old problematic code
    old_code = [
        'URL.createObjectURL',
        'generatePDFBlob',
        'downloadUrl: downloadUrl'
    ]
    
    has_old_code = []
    for old in old_code:
        if old in content:
            print(f"   ⚠️  {old} - still present (may cause issues)")
            has_old_code.append(old)
    
    if missing_updates:
        print(f"\n❌ Missing updates: {', '.join(missing_updates)}")
        return False
    elif has_old_code:
        print(f"\n⚠️  Old code still present: {', '.join(has_old_code)}")
        return False
    else:
        print(f"\n✅ All updates applied correctly")
        return True

def test_popup_js_updates():
    """Test if popup.js has been updated correctly"""
    print("\n🔍 Testing Popup.js Updates...")
    print("=" * 50)
    
    popup_path = "chrome-extension/popup.js"
    if not os.path.exists(popup_path):
        print(f"❌ {popup_path} not found")
        return False
    
    with open(popup_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for key updates
    if 'pdfResponse.pdfData' in content:
        print(f"   ✅ pdfResponse.pdfData found")
        return True
    elif 'pdfResponse.downloadUrl' in content:
        print(f"   ⚠️  Still using old downloadUrl")
        return False
    else:
        print(f"   ❌ No PDF response handling found")
        return False

def test_manifest_updates():
    """Test if manifest.json has been updated correctly"""
    print("\n🔍 Testing Manifest.json Updates...")
    print("=" * 50)
    
    manifest_path = "chrome-extension/manifest.json"
    if not os.path.exists(manifest_path):
        print(f"❌ {manifest_path} not found")
        return False
    
    with open(manifest_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for module support
    if '"type": "module"' in content:
        print(f"   ✅ Module support enabled")
        return True
    else:
        print(f"   ⚠️  Module support not enabled (may cause issues)")
        return False

def main():
    print("🚀 PDF Generation Test Suite")
    print("=" * 60)
    
    tests = [
        test_pdf_generator_file,
        test_background_js_updates,
        test_popup_js_updates,
        test_manifest_updates
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! PDF generation should work correctly.")
        print("\n📋 Next steps:")
        print("1. Reload the Chrome extension")
        print("2. Test 'Enhance & Generate PDF' on any webpage")
        print("3. Should work without URL.createObjectURL error")
    else:
        print("❌ Some tests failed. Please check the issues above.")
        print("\n🔧 To fix:")
        print("1. Ensure all files are updated correctly")
        print("2. Check for any missing components")
        print("3. Verify file paths are correct")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
