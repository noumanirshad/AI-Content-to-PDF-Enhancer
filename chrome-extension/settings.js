// Settings page functionality
class SettingsManager {
    constructor() {
        this.initializeElements();
        this.loadSettings();
        this.setupEventListeners();
    }

    initializeElements() {
        // Form elements
        this.geminiApiKey = document.getElementById('geminiApiKey');
        this.testApiKeyBtn = document.getElementById('testApiKey');
        this.apiKeyStatus = document.getElementById('apiKeyStatus');
        
        this.defaultEnhancementType = document.getElementById('defaultEnhancementType');
        this.defaultPdfStyle = document.getElementById('defaultPdfStyle');
        this.defaultIncludeImages = document.getElementById('defaultIncludeImages');
        this.defaultIncludeSources = document.getElementById('defaultIncludeSources');
        
        this.maxContentLength = document.getElementById('maxContentLength');
        this.processingTimeout = document.getElementById('processingTimeout');
        this.enableLogging = document.getElementById('enableLogging');
        this.showProcessingSteps = document.getElementById('showProcessingSteps');
        
        this.storeProcessingHistory = document.getElementById('storeProcessingHistory');
        this.anonymizeData = document.getElementById('anonymizeData');
        this.clearDataBtn = document.getElementById('clearData');
        
        // Action buttons
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.resetSettingsBtn = document.getElementById('resetSettings');
        this.exportSettingsBtn = document.getElementById('exportSettings');
        
        // Modal elements
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmMessage = document.getElementById('confirmMessage');
        this.confirmYes = document.getElementById('confirmYes');
        this.confirmNo = document.getElementById('confirmNo');
    }

    setupEventListeners() {
        // API key testing
        this.testApiKeyBtn.addEventListener('click', () => this.testApiKey());
        
        // Action buttons
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.resetSettingsBtn.addEventListener('click', () => this.resetSettings());
        this.exportSettingsBtn.addEventListener('click', () => this.exportSettings());
        this.clearDataBtn.addEventListener('click', () => this.confirmClearData());
        
        // Modal handlers
        this.confirmYes.addEventListener('click', () => this.handleConfirm());
        this.confirmNo.addEventListener('click', () => this.hideModal());
        
        // Auto-save on change
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.autoSave());
        });
    }

    async loadSettings() {
        try {
            const settings = await chrome.storage.sync.get({
                // API settings
                geminiApiKey: '',
                
                // Default enhancement settings
                enhancementType: 'summarize',
                pdfStyle: 'academic',
                includeImages: true,
                includeSources: true,
                
                // Advanced settings
                maxContentLength: 50000,
                processingTimeout: 60,
                enableLogging: true,
                showProcessingSteps: false,
                
                // Privacy settings
                storeProcessingHistory: false,
                anonymizeData: true
            });
            
            // Populate form fields
            this.geminiApiKey.value = settings.geminiApiKey;
            this.defaultEnhancementType.value = settings.enhancementType;
            this.defaultPdfStyle.value = settings.pdfStyle;
            this.defaultIncludeImages.checked = settings.includeImages;
            this.defaultIncludeSources.checked = settings.includeSources;
            
            this.maxContentLength.value = settings.maxContentLength;
            this.processingTimeout.value = settings.processingTimeout;
            this.enableLogging.checked = settings.enableLogging;
            this.showProcessingSteps.checked = settings.showProcessingSteps;
            
            this.storeProcessingHistory.checked = settings.storeProcessingHistory;
            this.anonymizeData.checked = settings.anonymizeData;
            
            // Update API key status
            this.updateApiKeyStatus(settings.geminiApiKey ? 'success' : 'error');
            
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showNotification('Error loading settings', 'error');
        }
    }

    async saveSettings() {
        try {
            const settings = {
                geminiApiKey: this.geminiApiKey.value,
                enhancementType: this.defaultEnhancementType.value,
                pdfStyle: this.defaultPdfStyle.value,
                includeImages: this.defaultIncludeImages.checked,
                includeSources: this.defaultIncludeSources.checked,
                maxContentLength: parseInt(this.maxContentLength.value),
                processingTimeout: parseInt(this.processingTimeout.value),
                enableLogging: this.enableLogging.checked,
                showProcessingSteps: this.showProcessingSteps.checked,
                storeProcessingHistory: this.storeProcessingHistory.checked,
                anonymizeData: this.anonymizeData.checked
            };
            
            await chrome.storage.sync.set(settings);
            this.showNotification('Settings saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Error saving settings', 'error');
        }
    }

    async autoSave() {
        // Debounce auto-save
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveSettings();
        }, 1000);
    }

    async testApiKey() {
        const apiKey = this.geminiApiKey.value.trim();
        
        if (!apiKey) {
            this.showNotification('Please enter an API key', 'error');
            return;
        }
        
        this.updateApiKeyStatus('pending');
        this.testApiKeyBtn.disabled = true;
        this.testApiKeyBtn.textContent = 'Testing...';
        
        try {
            // Use the latest Gemini 2.5 Flash model with v1beta API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Test message'
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 10
                    }
                })
            });
            
            if (response.ok) {
                this.updateApiKeyStatus('success');
                this.showNotification('API key is valid!', 'success');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Invalid API key');
            }
            
        } catch (error) {
            console.error('API key test failed:', error);
            this.updateApiKeyStatus('error');
            this.showNotification(`API key test failed: ${error.message}`, 'error');
        } finally {
            this.testApiKeyBtn.disabled = false;
            this.testApiKeyBtn.textContent = 'Test API Key';
        }
    }

    updateApiKeyStatus(status) {
        this.apiKeyStatus.className = `status-indicator ${status}`;
    }

    async resetSettings() {
        this.showConfirmModal(
            'Reset to Default Settings',
            'Are you sure you want to reset all settings to their default values? This action cannot be undone.',
            () => this.performReset()
        );
    }

    async performReset() {
        try {
            await chrome.storage.sync.clear();
            await this.loadSettings();
            this.showNotification('Settings reset to defaults', 'success');
        } catch (error) {
            console.error('Error resetting settings:', error);
            this.showNotification('Error resetting settings', 'error');
        }
    }

    async exportSettings() {
        try {
            const settings = await chrome.storage.sync.get();
            const settingsJson = JSON.stringify(settings, null, 2);
            
            const blob = new Blob([settingsJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-pdf-enhancer-settings-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Settings exported successfully!', 'success');
            
        } catch (error) {
            console.error('Error exporting settings:', error);
            this.showNotification('Error exporting settings', 'error');
        }
    }

    confirmClearData() {
        this.showConfirmModal(
            'Clear All Data',
            'Are you sure you want to clear all data including settings, logs, and processing history? This action cannot be undone.',
            () => this.performClearData()
        );
    }

    async performClearData() {
        try {
            await chrome.storage.sync.clear();
            await chrome.storage.local.clear();
            await this.loadSettings();
            this.showNotification('All data cleared successfully', 'success');
        } catch (error) {
            console.error('Error clearing data:', error);
            this.showNotification('Error clearing data', 'error');
        }
    }

    showConfirmModal(title, message, onConfirm) {
        this.confirmMessage.textContent = message;
        this.confirmModal.style.display = 'flex';
        this.pendingAction = onConfirm;
    }

    hideModal() {
        this.confirmModal.style.display = 'none';
        this.pendingAction = null;
    }

    handleConfirm() {
        if (this.pendingAction) {
            this.pendingAction();
        }
        this.hideModal();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});