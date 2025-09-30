# AI Content-to-PDF Enhancer

A powerful Chrome extension that transforms web content into enriched, validated, and professionally formatted PDF documents using AI technology.

## 🚀 Features

- **Smart Content Extraction**: Automatically extracts main content from web pages using advanced parsing algorithms
- **AI-Powered Enhancement**: Uses Google's Gemini AI to summarize, expand, validate, and enhance content
- **Professional PDF Generation**: Creates well-formatted PDFs with proper styling and structure
- **Multiple Enhancement Types**: Choose from summarization, expansion, validation, or comprehensive enhancement
- **Flexible PDF Styles**: Academic, executive, or casual formatting options
- **Source Attribution**: Includes proper citations and references
- **Privacy-Focused**: Local processing with optional cloud AI integration
- **Comprehensive Logging**: Detailed process tracking and error handling

## 📋 Requirements

- Google Chrome browser (Manifest V3 compatible)
- Gemini API key (free tier available)
- Internet connection for AI processing

## 🛠️ Installation

### Option 1: Load as Unpacked Extension (Development)

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd AI-Content-to-PDF-Enhancer
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `chrome-extension/` folder
   - The extension should appear in your extensions list

4. **Get a Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for configuration

5. **Configure the extension**
   - Click the extension icon in your browser toolbar
   - Click "Settings" to open the settings page
   - Enter your Gemini API key
   - Test the API key to ensure it's working

### Option 2: Install from Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store once published.

## 🎯 Usage

### Basic Usage

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

### Advanced Usage

- **Preview Content**: Click "Preview Content" to see what will be extracted before processing
- **Custom Settings**: Access the settings page to configure default options
- **API Configuration**: Set up your Gemini API key and adjust processing parameters
- **Privacy Controls**: Configure data storage and logging preferences

## ⚙️ Configuration

### Settings Page

Access the settings page by clicking the extension icon and selecting "Settings":

#### API Configuration
- **Gemini API Key**: Your Google AI API key
- **Test API Key**: Verify your API key is working

#### Default Enhancement Settings
- **Enhancement Type**: Default type for new enhancements
- **PDF Style**: Default formatting style
- **Include Images**: Whether to include images by default
- **Include Sources**: Whether to include citations by default

#### Advanced Settings
- **Maximum Content Length**: Limit content size for processing
- **Processing Timeout**: Maximum time to wait for AI processing
- **Enable Logging**: Detailed logging for debugging
- **Show Processing Steps**: Display detailed progress information

#### Data & Privacy
- **Store Processing History**: Keep local records of processed content
- **Anonymize Data**: Remove sensitive information from logs
- **Clear All Data**: Reset all settings and data

## 🔧 Development

### Project Structure

```
AI-Content-to-PDF-Enhancer/
├── chrome-extension/              # Chrome extension files
│   ├── manifest.json             # Extension manifest
│   ├── popup.html/css/js         # Main popup interface
│   ├── content.js                # Content extraction script
│   ├── background.js             # Background service worker
│   ├── readability.js            # Content parsing library
│   ├── logger.js                 # Logging system
│   ├── settings.html/css/js      # Settings page
│   ├── pdf-template.html         # PDF generation template
│   └── README.md                 # Extension documentation
├── chrome-extension-icons/        # Extension icons
│   ├── icon16.png               # 16x16 toolbar icon
│   ├── icon32.png               # 32x32 management icon
│   ├── icon48.png               # 48x48 details icon
│   ├── icon128.png              # 128x128 store icon
│   └── README.md                # Icons documentation
├── AI_Content_to_PDF_Enhancer_Testing.ipynb  # Testing notebook
├── install.py                    # Installation script
├── README.md                     # Main project documentation
├── INSTALLATION_GUIDE.md         # Step-by-step installation
├── PROJECT_SUMMARY.md            # Technical overview
└── PROJECT_STRUCTURE.md          # Folder structure guide
```

### Testing

Use the included Jupyter notebook for comprehensive testing:

1. **Install dependencies**:
   ```bash
   pip install requests beautifulsoup4 reportlab
   ```

2. **Open the notebook**:
   ```bash
   jupyter notebook AI_Content_to_PDF_Enhancer_Testing.ipynb
   ```

3. **Configure your API key** in the notebook
4. **Run the cells** to test different components

### Logging

The extension includes comprehensive logging:

- **Console Logs**: Check browser console for real-time logs
- **Storage Logs**: View logs in Chrome storage (chrome://extensions/ → Extension details → Inspect views)
- **File Logs**: Jupyter notebook creates `ai_enhancer_test.log`

## 🚨 Troubleshooting

### Common Issues

1. **"API key not found" error**
   - Ensure you've entered your Gemini API key in settings
   - Test the API key using the "Test API Key" button
   - Check that the API key has proper permissions

2. **Content extraction fails**
   - Some websites may block content extraction
   - Try the "Preview Content" feature to see what's being extracted
   - Check the console for error messages

3. **PDF generation fails**
   - Ensure you have sufficient browser permissions
   - Check that the content was successfully enhanced
   - Try reducing the content length in settings

4. **Slow processing**
   - Large content takes longer to process
   - Check your internet connection
   - Consider reducing the maximum content length

### Debug Mode

Enable debug mode in settings to get detailed logging information:

1. Open extension settings
2. Enable "Show Detailed Processing Steps"
3. Enable "Enable Detailed Logging"
4. Check browser console for detailed information

## 📊 Performance

### Processing Times (Approximate)

- **Content Extraction**: 1-3 seconds
- **AI Enhancement**: 5-15 seconds (depending on content length)
- **PDF Generation**: 2-5 seconds
- **Total**: 8-23 seconds per page

### Content Limits

- **Maximum Content Length**: 50,000 characters (configurable)
- **Maximum Processing Time**: 60 seconds (configurable)
- **Supported Content Types**: Text, HTML, images, links

## 🔒 Privacy & Security

- **Local Processing**: Content extraction happens locally in your browser
- **API Calls**: Only enhanced content is sent to Gemini API
- **Data Storage**: Optional local storage of processing history
- **No Tracking**: No user tracking or analytics
- **Secure API**: All API calls use HTTPS encryption

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs and request features on GitHub Issues
- **Documentation**: Check this README and inline code comments
- **Testing**: Use the provided Jupyter notebook for testing

## 🔄 Version History

### v1.0.0 (September 28, 2025)
- Initial release
- Content extraction using Readability.js
- Gemini AI integration
- PDF generation with multiple styles
- Comprehensive settings and logging
- Chrome extension with Manifest V3

## 🙏 Acknowledgments

- **Mozilla Readability**: For content extraction algorithms
- **Google Gemini**: For AI enhancement capabilities
- **Chrome Extensions API**: For browser integration
- **ReportLab**: For PDF generation (testing notebook)

---

**Made with ❤️ for better web content consumption**
