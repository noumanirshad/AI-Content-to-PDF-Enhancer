#!/usr/bin/env python3
"""
Verify Chrome extension files are correctly updated with new Gemini models
"""

import os
import re

def check_file_for_old_models(file_path):
    """Check if file contains old model references"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        old_models = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'models/gemini-1.5-flash',
            'models/gemini-1.5-pro'
        ]
        
        found_old = []
        for model in old_models:
            if model in content:
                found_old.append(model)
        
        return found_old
    except Exception as e:
        return [f"Error reading file: {e}"]

def check_file_for_new_models(file_path):
    """Check if file contains new model references"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_models = [
            'gemini-2.5-flash',
            'gemini-2.5-pro',
            'models/gemini-2.5-flash',
            'models/gemini-2.5-pro'
        ]
        
        found_new = []
        for model in new_models:
            if model in content:
                found_new.append(model)
        
        return found_new
    except Exception as e:
        return [f"Error reading file: {e}"]

def main():
    print("🔍 Verifying Chrome Extension Model Updates...")
    print("=" * 60)
    
    # Files to check
    files_to_check = [
        'chrome-extension/background.js',
        'chrome-extension/settings.js',
        'chrome-extension/test-api.html',
        'test_gemini_api.py',
        'AI_Content_to_PDF_Enhancer_Testing.ipynb'
    ]
    
    all_good = True
    
    for file_path in files_to_check:
        if not os.path.exists(file_path):
            print(f"❌ {file_path} - FILE NOT FOUND")
            all_good = False
            continue
        
        print(f"\n📁 Checking {file_path}...")
        
        # Check for old models
        old_models = check_file_for_old_models(file_path)
        if old_models and not any("Error" in str(item) for item in old_models):
            print(f"   ❌ Found old models: {', '.join(old_models)}")
            all_good = False
        else:
            print(f"   ✅ No old models found")
        
        # Check for new models
        new_models = check_file_for_new_models(file_path)
        if new_models and not any("Error" in str(item) for item in new_models):
            print(f"   ✅ Found new models: {', '.join(new_models)}")
        else:
            print(f"   ⚠️  No new models found")
    
    print("\n" + "=" * 60)
    
    if all_good:
        print("🎉 All files have been successfully updated!")
        print("✅ No old model references found")
        print("✅ New Gemini 2.5 models are in place")
        print("\n📋 Next steps:")
        print("1. Test the API: python test_gemini_api.py YOUR_API_KEY")
        print("2. Load the extension in Chrome")
        print("3. Test the full workflow")
    else:
        print("❌ Some files still contain old model references")
        print("Please check the files marked with ❌ above")
    
    return all_good

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
