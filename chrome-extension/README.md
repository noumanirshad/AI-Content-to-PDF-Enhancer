# Chrome Extension Files

This folder contains all the files needed to run the AI Content-to-PDF Enhancer Chrome extension.

## 📁 File Structure

```
chrome-extension/
├── manifest.json          # Extension manifest (Chrome configuration)
├── popup.html             # Main popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── content.js             # Content extraction script
├── background.js          # Background service worker
├── readability.js         # Content parsing library
├── logger.js              # Logging system
├── settings.html          # Settings page
├── settings.css           # Settings styling
├── settings.js            # Settings functionality
├── pdf-template.html      # PDF generation template
├── icon16.png             # 16x16 toolbar icon
├── icon32.png             # 32x32 management icon
├── icon48.png             # 48x48 details icon
├── icon128.png            # 128x128 store icon
└── README.md              # This documentation
```

## 🚀 Installation

1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer Mode** (toggle in top-right corner)
3. **Click "Load unpacked"**
4. **Select this folder** (`chrome-extension`)
5. **The extension should appear** in your extensions list

## ⚙️ Configuration

1. **Click the extension icon** in your browser toolbar
2. **Click "Settings"** to open the settings page
3. **Enter your Gemini API key** in the API Configuration section
4. **Test the API key** to verify it works
5. **Save your settings**

## 📋 Requirements

- Google Chrome browser (Manifest V3 compatible)
- Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
- Internet connection for AI processing

## 🔧 Usage

1. **Navigate to any webpage** you want to enhance
2. **Click the extension icon** in your browser toolbar
3. **Select enhancement options**:
   - Enhancement Type: Summarize, Expand, Validate, or Comprehensive
   - PDF Style: Academic, Executive, or Casual
   - Include Images: Yes/No
   - Include Sources: Yes/No
4. **Click "Enhance & Generate PDF"**
5. **Wait for processing** (progress will be shown)
6. **Download the enhanced PDF** when ready

## 🛠️ Development

### File Descriptions

- **manifest.json**: Chrome extension configuration file
- **popup.html/css/js**: Main user interface for the extension
- **content.js**: Script that runs on web pages to extract content
- **background.js**: Service worker that handles AI processing and PDF generation
- **readability.js**: Library for smart content extraction from web pages
- **logger.js**: Logging system for debugging and monitoring
- **settings.html/css/js**: Settings page for configuration
- **pdf-template.html**: HTML template for PDF generation

### Key Features

- **Content Extraction**: Uses Readability.js and heuristics to extract main content
- **AI Enhancement**: Integrates with Google Gemini AI for content enhancement
- **PDF Generation**: Creates professional PDFs with multiple styling options
- **Settings Management**: Comprehensive configuration options
- **Error Handling**: Robust error handling and user feedback
- **Logging**: Detailed logging for debugging and monitoring

## 🔍 Troubleshooting

### Common Issues

1. **"API key not found" error**
   - Ensure you've entered your Gemini API key in settings
   - Test the API key using the "Test API Key" button

2. **Content extraction fails**
   - Some websites may block content extraction
   - Try the "Preview Content" feature to see what's being extracted

3. **PDF generation fails**
   - Ensure you have sufficient browser permissions
   - Check that the content was successfully enhanced

### Debug Mode

Enable debug mode in settings to get detailed logging information:
1. Open extension settings
2. Enable "Show Detailed Processing Steps"
3. Enable "Enable Detailed Logging"
4. Check browser console for detailed information

## 📚 Related Files

- **Icons**: Located in `../chrome-extension-icons/` folder
- **Testing**: See `../AI_Content_to_PDF_Enhancer_Testing.ipynb` for comprehensive testing
- **Documentation**: See main `../README.md` for complete project documentation

---

**Note**: This extension requires the icons to be in the `../chrome-extension-icons/` folder relative to this directory.
