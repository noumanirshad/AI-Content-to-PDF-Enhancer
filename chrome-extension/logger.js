// Logging system for AI Content-to-PDF Enhancer
class Logger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.setupStorage();
    }

    setupStorage() {
        // Load existing logs from storage
        chrome.storage.local.get(['appLogs'], (result) => {
            this.logs = result.appLogs || [];
        });
    }

    log(level, message, data = {}) {
        const logEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            data: this.sanitizeData(data),
            url: this.getCurrentUrl(),
            userAgent: navigator.userAgent
        };

        this.logs.push(logEntry);
        
        // Keep only the most recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // Save to storage
        this.saveToStorage();

        // Console output
        this.outputToConsole(logEntry);

        return logEntry;
    }

    info(message, data = {}) {
        return this.log('info', message, data);
    }

    warn(message, data = {}) {
        return this.log('warn', message, data);
    }

    error(message, data = {}) {
        return this.log('error', message, data);
    }

    debug(message, data = {}) {
        return this.log('debug', message, data);
    }

    sanitizeData(data) {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            // Remove sensitive information
            if (this.isSensitiveKey(key)) {
                sanitized[key] = '[REDACTED]';
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeData(value);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    isSensitiveKey(key) {
        const sensitiveKeys = [
            'apiKey', 'password', 'token', 'secret', 'key',
            'authorization', 'auth', 'credential', 'private'
        ];
        
        return sensitiveKeys.some(sensitive => 
            key.toLowerCase().includes(sensitive)
        );
    }

    getCurrentUrl() {
        try {
            return window.location?.href || 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveToStorage() {
        chrome.storage.local.set({ appLogs: this.logs });
    }

    outputToConsole(logEntry) {
        const { level, message, data, timestamp } = logEntry;
        const prefix = `[AI Enhancer ${level}] ${timestamp}`;
        
        switch (level) {
            case 'ERROR':
                console.error(prefix, message, data);
                break;
            case 'WARN':
                console.warn(prefix, message, data);
                break;
            case 'DEBUG':
                console.debug(prefix, message, data);
                break;
            default:
                console.log(prefix, message, data);
        }
    }

    getLogs(filter = {}) {
        let filteredLogs = [...this.logs];

        if (filter.level) {
            filteredLogs = filteredLogs.filter(log => 
                log.level === filter.level.toUpperCase()
            );
        }

        if (filter.startDate) {
            filteredLogs = filteredLogs.filter(log => 
                new Date(log.timestamp) >= new Date(filter.startDate)
            );
        }

        if (filter.endDate) {
            filteredLogs = filteredLogs.filter(log => 
                new Date(log.timestamp) <= new Date(filter.endDate)
            );
        }

        if (filter.message) {
            filteredLogs = filteredLogs.filter(log => 
                log.message.toLowerCase().includes(filter.message.toLowerCase())
            );
        }

        return filteredLogs;
    }

    exportLogs(format = 'json') {
        const logs = this.getLogs();
        
        switch (format.toLowerCase()) {
            case 'csv':
                return this.exportToCSV(logs);
            case 'txt':
                return this.exportToText(logs);
            default:
                return JSON.stringify(logs, null, 2);
        }
    }

    exportToCSV(logs) {
        if (logs.length === 0) return '';
        
        const headers = ['timestamp', 'level', 'message', 'url'];
        const csvRows = [headers.join(',')];
        
        logs.forEach(log => {
            const row = [
                log.timestamp,
                log.level,
                `"${log.message.replace(/"/g, '""')}"`,
                log.url
            ];
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }

    exportToText(logs) {
        return logs.map(log => 
            `[${log.timestamp}] ${log.level}: ${log.message} (${log.url})`
        ).join('\n');
    }

    clearLogs() {
        this.logs = [];
        this.saveToStorage();
    }

    getStats() {
        const stats = {
            total: this.logs.length,
            byLevel: {},
            byHour: {},
            errors: 0,
            warnings: 0
        };

        this.logs.forEach(log => {
            // Count by level
            stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
            
            // Count errors and warnings
            if (log.level === 'ERROR') stats.errors++;
            if (log.level === 'WARN') stats.warnings++;
            
            // Count by hour
            const hour = new Date(log.timestamp).getHours();
            stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
        });

        return stats;
    }
}

// Create global logger instance
const logger = new Logger();

// Make logger available globally
if (typeof window !== 'undefined') {
    window.logger = logger;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
}
