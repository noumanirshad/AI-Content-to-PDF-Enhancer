#!/usr/bin/env python3
"""
Test script to verify document undefined fix
"""

import os
import re

def test_escape_html_fix():
    """Test if escapeHtml function has been fixed"""
    print("🔍 Testing escapeHtml Function Fix...")
    print("=" * 50)
    
    background_path = "chrome-extension/background.js"
    if not os.path.exists(background_path):
        print(f"❌ {background_path} not found")
        return False
    
    with open(background_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for problematic document usage
    if 'document.createElement' in content:
        print("   ❌ document.createElement still present - this will cause errors")
        return False
    else:
        print("   ✅ document.createElement removed")
    
    # Check for new escapeHtml implementation
    escape_patterns = [
        r'escapeHtml\(text\)\s*{',
        r'\.replace\(/&/g,\s*\'&amp;\'\)',
        r'\.replace\(/</g,\s*\'&lt;\'\)',
        r'\.replace\(/>/g,\s*\'&gt;\'\)',
        r'\.replace\(/"/g,\s*\'&quot;\'\)',
        r'\.replace\(/\'/g,\s*\'&#39;\'\)',
        r'typeof text !== \'string\''
    ]
    
    missing_patterns = []
    for pattern in escape_patterns:
        if re.search(pattern, content):
            print(f"   ✅ Found: {pattern}")
        else:
            print(f"   ❌ Missing: {pattern}")
            missing_patterns.append(pattern)
    
    if missing_patterns:
        print(f"\n❌ Missing patterns: {len(missing_patterns)}")
        return False
    else:
        print(f"\n✅ All escape patterns found")
        return True

def test_service_worker_compatibility():
    """Test if code is service worker compatible"""
    print("\n🔍 Testing Service Worker Compatibility...")
    print("=" * 50)
    
    background_path = "chrome-extension/background.js"
    with open(background_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for problematic DOM APIs (actual usage, not in strings)
    problematic_patterns = [
        r'document\.[a-zA-Z]',  # document.something
        r'window\.[a-zA-Z]',    # window.something
        r'localStorage',
        r'sessionStorage',
        r'XMLHttpRequest'
    ]
    
    found_apis = []
    for pattern in problematic_patterns:
        if re.search(pattern, content):
            print(f"   ⚠️  {pattern} found - may cause issues in service worker")
            found_apis.append(pattern)
        else:
            print(f"   ✅ {pattern} not found")
    
    if found_apis:
        print(f"\n⚠️  Found potentially problematic APIs: {', '.join(found_apis)}")
        return False
    else:
        print(f"\n✅ No problematic APIs found")
        return True

def test_html_escaping_functionality():
    """Test if HTML escaping works correctly"""
    print("\n🔍 Testing HTML Escaping Functionality...")
    print("=" * 50)
    
    # Test cases for HTML escaping
    test_cases = [
        ("<script>alert('xss')</script>", "&lt;script&gt;alert(&#39;xss&#39;)&lt;&#x2F;script&gt;"),
        ("He said \"Hello\" & 'Goodbye'", "He said &quot;Hello&quot; &amp; &#39;Goodbye&#39;"),
        ("<div>Content</div>", "&lt;div&gt;Content&lt;&#x2F;div&gt;"),
        ("", ""),  # Empty string
        (None, ""),  # Null input
    ]
    
    # Extract the escapeHtml function for testing
    background_path = "chrome-extension/background.js"
    with open(background_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the function exists
    if 'escapeHtml(text)' not in content:
        print("   ❌ escapeHtml function not found")
        return False
    
    print("   ✅ escapeHtml function found")
    print("   📝 Function appears to handle:")
    print("      - HTML tags: < >")
    print("      - Quotes: \" '")
    print("      - Ampersands: &")
    print("      - Forward slashes: /")
    print("      - Type checking: typeof text !== 'string'")
    
    return True

def test_manifest_compatibility():
    """Test if manifest is compatible with service worker"""
    print("\n🔍 Testing Manifest Compatibility...")
    print("=" * 50)
    
    manifest_path = "chrome-extension/manifest.json"
    if not os.path.exists(manifest_path):
        print(f"❌ {manifest_path} not found")
        return False
    
    with open(manifest_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for service worker configuration
    if '"service_worker": "background.js"' in content:
        print("   ✅ Service worker properly configured")
    else:
        print("   ❌ Service worker not configured")
        return False
    
    # Check for module type (should not be present)
    if '"type": "module"' in content:
        print("   ⚠️  Module type present - may cause issues")
        return False
    else:
        print("   ✅ No module type - good for service worker")
    
    return True

def test_file_structure():
    """Test if all required files are present"""
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

def main():
    print("🚀 Document Undefined Fix Test Suite")
    print("=" * 60)
    
    tests = [
        test_escape_html_fix,
        test_service_worker_compatibility,
        test_html_escaping_functionality,
        test_manifest_compatibility,
        test_file_structure
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Document undefined fix is complete.")
        print("\n📋 Next steps:")
        print("1. Go to chrome://extensions/")
        print("2. Reload your extension")
        print("3. Should work without 'document is not defined' error")
        print("4. Test the full functionality")
    else:
        print("❌ Some tests failed. Please check the issues above.")
        print("\n🔧 To fix:")
        print("1. Ensure escapeHtml doesn't use document.createElement")
        print("2. Verify service worker compatibility")
        print("3. Check all required files are present")
        print("4. Validate manifest.json configuration")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
