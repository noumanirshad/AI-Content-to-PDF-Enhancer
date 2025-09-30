class AIEnhancerPopup {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadSettings();
    }

    initializeElements() {
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.status = document.getElementById('status');
        this.enhanceBtn = document.getElementById('enhanceBtn');
        this.previewBtn = document.getElementById('previewBtn');
        this.downloadPdfBtn = document.getElementById('downloadPdfBtn');
        this.spinner = document.getElementById('spinner');
        this.preview = document.getElementById('preview');
        this.previewContent = document.getElementById('previewContent');
        this.progress = document.getElementById('progress');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.lastPdfData = null;
    }

    setupEventListeners() {
        this.enhanceBtn.addEventListener('click', () => this.handleEnhance());
        this.previewBtn.addEventListener('click', () => this.handlePreview());
        this.downloadPdfBtn.addEventListener('click', () => this.handleDownloadPdf());
        
        // Add settings button handler
        const openSettingsBtn = document.getElementById('openSettings');
        if (openSettingsBtn) {
            openSettingsBtn.addEventListener('click', () => {
                chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
            });
        }
        
        // Save settings when changed
        const inputs = document.querySelectorAll('select, input[type="checkbox"]');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.saveSettings());
        });
    }

    async loadSettings() {
        try {
            const settings = await chrome.storage.sync.get({
                enhancementType: 'summarize',
                pdfStyle: 'academic',
                includeImages: true,
                includeSources: true
            });
            
            document.getElementById('enhancementType').value = settings.enhancementType;
            document.getElementById('pdfStyle').value = settings.pdfStyle;
            document.getElementById('includeImages').checked = settings.includeImages;
            document.getElementById('includeSources').checked = settings.includeSources;
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            const settings = {
                enhancementType: document.getElementById('enhancementType').value,
                pdfStyle: document.getElementById('pdfStyle').value,
                includeImages: document.getElementById('includeImages').checked,
                includeSources: document.getElementById('includeSources').checked
            };
            
            await chrome.storage.sync.set(settings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    updateStatus(message, type = 'ready') {
        this.statusText.textContent = message;
        this.status.className = `status ${type}`;
        
        if (type === 'processing') {
            this.statusIndicator.style.animation = 'spin 1s linear infinite';
        } else {
            this.statusIndicator.style.animation = 'pulse 2s infinite';
        }
    }

    showProgress(show = true) {
        this.progress.style.display = show ? 'block' : 'none';
        if (show) {
            this.progressBar.style.width = '0%';
        }
    }

    updateProgress(percentage, text) {
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = text;
    }

    async injectContentScript(tabId) {
        try {
            // First, check if content script is already injected
            try {
                await chrome.tabs.sendMessage(tabId, { action: 'ping' });
                return true; // Already injected
            } catch (e) {
                // Not injected, continue with injection
            }

            // Inject Readability first
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['readability.js']
            });

            // Then inject content script
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });

            return true;
        } catch (error) {
            console.error('Failed to inject content script:', error);
            throw new Error('Failed to inject content extraction script. Please refresh the page and try again.');
        }
    }

    async handlePreview() {
        try {
            this.updateStatus('Extracting content...', 'processing');
            this.showProgress(true);
            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Inject content script first
            await this.injectContentScript(tab.id);
            
            // Wait a bit for script to initialize
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Extract content from current tab
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
            
            if (response && response.success) {
                this.previewContent.innerHTML = this.formatPreviewContent(response.data);
                this.preview.style.display = 'block';
                this.updateStatus('Content extracted successfully', 'ready');
                this.showProgress(false);
            } else {
                throw new Error(response?.error || 'Failed to extract content');
            }
        } catch (error) {
            console.error('Preview error:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
            this.showProgress(false);
        }
    }

    formatPreviewContent(data) {
        const maxLength = 500;
        let content = data.textContent || data.content || '';
        
        if (content.length > maxLength) {
            content = content.substring(0, maxLength) + '...';
        }
        
        return `
            <div style="margin-bottom: 10px;">
                <strong>Title:</strong> ${data.title || 'Untitled'}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>URL:</strong> ${data.url || 'Unknown'}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Word Count:</strong> ${data.wordCount || 0}
            </div>
            <div>
                <strong>Content Preview:</strong><br>
                ${content.replace(/\n/g, '<br>')}
            </div>
        `;
    }

    async handleEnhance() {
        try {
            this.enhanceBtn.disabled = true;
            this.spinner.style.display = 'inline-block';
            this.updateStatus('Starting enhancement process...', 'processing');
            this.showProgress(true);

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Step 1: Inject content script
            this.updateProgress(10, 'Preparing content extraction...');
            await this.injectContentScript(tab.id);
            
            // Wait for script initialization
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Step 2: Extract content
            this.updateProgress(20, 'Extracting content...');
            const extractResponse = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
            
            if (!extractResponse || !extractResponse.success) {
                throw new Error(extractResponse?.error || 'Failed to extract content');
            }

            // Step 3: Send to background for AI processing
            this.updateProgress(40, 'Processing with AI...');
            const settings = {
                enhancementType: document.getElementById('enhancementType').value,
                pdfStyle: document.getElementById('pdfStyle').value,
                includeImages: document.getElementById('includeImages').checked,
                includeSources: document.getElementById('includeSources').checked
            };

            const enhanceResponse = await chrome.runtime.sendMessage({
                action: 'enhanceContent',
                data: extractResponse.data,
                settings: settings
            });

            if (!enhanceResponse || !enhanceResponse.success) {
                throw new Error(enhanceResponse?.error || 'AI processing failed');
            }

            // Step 4: Generate PDF
            this.updateProgress(80, 'Generating PDF...');
            const pdfResponse = await chrome.runtime.sendMessage({
                action: 'generatePDF',
                data: enhanceResponse.data,
                settings: settings
            });

            if (!pdfResponse || !pdfResponse.success) {
                throw new Error(pdfResponse?.error || 'PDF generation failed');
            }

            // Step 5: Store PDF data and show download button
            this.updateProgress(100, 'PDF ready for download...');
            this.lastPdfData = pdfResponse;
            this.downloadPdfBtn.style.display = 'block';
            
            this.updateStatus('PDF generated successfully! Click "Download PDF" to save.', 'ready');
            this.showProgress(false);

        } catch (error) {
            console.error('Enhancement error:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
            this.showProgress(false);
        } finally {
            this.enhanceBtn.disabled = false;
            this.spinner.style.display = 'none';
        }
    }

    async handleDownloadPdf() {
        if (!this.lastPdfData) {
            this.updateStatus('No PDF data available. Please generate a PDF first.', 'error');
            return;
        }

        try {
            this.downloadPdfBtn.disabled = true;
            this.updateStatus('Downloading PDF...', 'processing');

            await chrome.downloads.download({
                url: this.lastPdfData.pdfData,
                filename: this.lastPdfData.filename,
                saveAs: true
            });

            this.updateStatus('PDF downloaded successfully!', 'ready');
        } catch (error) {
            console.error('Download error:', error);
            this.updateStatus(`Download failed: ${error.message}`, 'error');
        } finally {
            this.downloadPdfBtn.disabled = false;
        }
    }

    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIEnhancerPopup();
});