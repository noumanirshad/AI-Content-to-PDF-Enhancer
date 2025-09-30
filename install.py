#!/usr/bin/env python3
"""
Installation script for AI Content-to-PDF Enhancer
"""

import os
import sys
import subprocess
import json

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_dependencies():
    """Install required Python dependencies for testing"""
    print("\n📦 Installing Python dependencies...")
    
    dependencies = [
        'requests',
        'beautifulsoup4',
        'reportlab',
        'jupyter',
        'pillow'
    ]
    
    for dep in dependencies:
        try:
            print(f"Installing {dep}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', dep])
            print(f"✅ {dep} installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {dep}: {e}")
            return False
    
    return True

def create_directories():
    """Create necessary directories"""
    print("\n📁 Creating directories...")
    
    directories = [
        'icons',
        'logs',
        'temp'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")

def validate_files():
    """Validate that all required files exist"""
    print("\n🔍 Validating files...")
    
    required_files = [
        'manifest.json',
        'popup.html',
        'popup.css',
        'popup.js',
        'content.js',
        'background.js',
        'readability.js',
        'logger.js',
        'settings.html',
        'settings.css',
        'settings.js',
        'pdf-template.html',
        'AI_Content_to_PDF_Enhancer_Testing.ipynb',
        'README.md'
    ]
    
    missing_files = []
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - MISSING")
            missing_files.append(file)
    
    if missing_files:
        print(f"\n❌ Missing files: {', '.join(missing_files)}")
        return False
    
    return True

def create_config_file():
    """Create a default configuration file"""
    print("\n⚙️ Creating configuration file...")
    
    config = {
        "version": "1.0.0",
        "api_endpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        "default_settings": {
            "enhancement_type": "summarize",
            "pdf_style": "academic",
            "include_images": True,
            "include_sources": True,
            "max_content_length": 50000,
            "processing_timeout": 60,
            "enable_logging": True
        },
        "chrome_extension": {
            "manifest_version": 3,
            "permissions": ["activeTab", "storage", "scripting", "downloads"],
            "host_permissions": ["http://*/*", "https://*/*"]
        }
    }
    
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ Configuration file created: config.json")

def display_instructions():
    """Display installation instructions"""
    print("\n" + "="*60)
    print("🎉 AI Content-to-PDF Enhancer Installation Complete!")
    print("="*60)
    
    print("\n📋 Next Steps:")
    print("1. Get a Gemini API key from: https://makersuite.google.com/app/apikey")
    print("2. Open Chrome and go to: chrome://extensions/")
    print("3. Enable 'Developer mode' (toggle in top right)")
    print("4. Click 'Load unpacked' and select this folder")
    print("5. Click the extension icon and go to Settings")
    print("6. Enter your Gemini API key and test it")
    
    print("\n🧪 Testing:")
    print("1. Install Jupyter: pip install jupyter")
    print("2. Run: jupyter notebook AI_Content_to_PDF_Enhancer_Testing.ipynb")
    print("3. Configure your API key in the notebook")
    print("4. Run all cells to test the system")
    
    print("\n📚 Documentation:")
    print("- README.md: Complete usage guide")
    print("- Settings page: Configure the extension")
    print("- Jupyter notebook: Testing and development")
    
    print("\n🔧 Troubleshooting:")
    print("- Check browser console for errors")
    print("- Verify API key is correct")
    print("- Check internet connection")
    print("- Review logs in extension storage")
    
    print("\n" + "="*60)

def main():
    """Main installation function"""
    print("🚀 AI Content-to-PDF Enhancer Installation")
    print("="*50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Validate files
    if not validate_files():
        print("\n❌ Installation failed due to missing files")
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Installation failed due to dependency issues")
        sys.exit(1)
    
    # Create configuration
    create_config_file()
    
    # Display instructions
    display_instructions()
    
    print("\n✅ Installation completed successfully!")

if __name__ == "__main__":
    main()
