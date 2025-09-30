#!/usr/bin/env python3
"""
Verification script for Chrome extension loading
"""

import os
import json
import sys

def verify_extension_structure():
    """Verify that the Chrome extension has all required files"""
    print("🔍 Verifying Chrome Extension Structure...")
    
    extension_dir = "chrome-extension"
    required_files = [
        "manifest.json",
        "popup.html",
        "popup.css", 
        "popup.js",
        "content.js",
        "background.js",
        "readability.js",
        "logger.js",
        "settings.html",
        "settings.css",
        "settings.js",
        "pdf-template.html",
        "icon16.png",
        "icon32.png", 
        "icon48.png",
        "icon128.png"
    ]
    
    missing_files = []
    for file in required_files:
        file_path = os.path.join(extension_dir, file)
        if os.path.exists(file_path):
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - MISSING")
            missing_files.append(file)
    
    return len(missing_files) == 0, missing_files

def verify_manifest():
    """Verify that manifest.json is valid and properly configured"""
    print("\n🔍 Verifying Manifest.json...")
    
    try:
        with open("chrome-extension/manifest.json", 'r') as f:
            manifest = json.load(f)
        
        # Check required fields
        required_fields = [
            "manifest_version", "name", "version", "description",
            "permissions", "background", "content_scripts", "action", "icons"
        ]
        
        for field in required_fields:
            if field in manifest:
                print(f"✅ {field}")
            else:
                print(f"❌ {field} - MISSING")
                return False
        
        # Check icon paths
        icons = manifest.get("icons", {})
        icon_sizes = ["16", "32", "48", "128"]
        
        for size in icon_sizes:
            if size in icons:
                icon_path = icons[size]
                if icon_path == f"icon{size}.png":
                    print(f"✅ icon{size}.png path correct")
                else:
                    print(f"❌ icon{size}.png path incorrect: {icon_path}")
                    return False
            else:
                print(f"❌ icon{size}.png - MISSING")
                return False
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in manifest.json: {e}")
        return False
    except FileNotFoundError:
        print("❌ manifest.json not found")
        return False

def verify_icons():
    """Verify that icon files exist and are valid"""
    print("\n🔍 Verifying Icon Files...")
    
    icon_sizes = [16, 32, 48, 128]
    
    for size in icon_sizes:
        icon_file = f"chrome-extension/icon{size}.png"
        if os.path.exists(icon_file):
            file_size = os.path.getsize(icon_file)
            if file_size > 0:
                print(f"✅ icon{size}.png ({file_size} bytes)")
            else:
                print(f"❌ icon{size}.png - Empty file")
                return False
        else:
            print(f"❌ icon{size}.png - File not found")
            return False
    
    return True

def main():
    """Main verification function"""
    print("🚀 Chrome Extension Verification")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("chrome-extension"):
        print("❌ chrome-extension folder not found!")
        print("Please run this script from the project root directory.")
        sys.exit(1)
    
    # Verify structure
    structure_ok, missing_files = verify_extension_structure()
    
    # Verify manifest
    manifest_ok = verify_manifest()
    
    # Verify icons
    icons_ok = verify_icons()
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 VERIFICATION SUMMARY")
    print("=" * 50)
    
    if structure_ok and manifest_ok and icons_ok:
        print("🎉 ALL CHECKS PASSED!")
        print("✅ Chrome extension is ready to load")
        print("\n📋 Next Steps:")
        print("1. Open Chrome and go to chrome://extensions/")
        print("2. Enable Developer mode")
        print("3. Click 'Load unpacked'")
        print("4. Select the 'chrome-extension' folder")
        print("5. The extension should load successfully!")
    else:
        print("❌ SOME CHECKS FAILED!")
        if not structure_ok:
            print(f"❌ Missing files: {', '.join(missing_files)}")
        if not manifest_ok:
            print("❌ Manifest.json issues found")
        if not icons_ok:
            print("❌ Icon file issues found")
        print("\n🔧 Please fix the issues above before loading the extension.")

if __name__ == "__main__":
    main()
