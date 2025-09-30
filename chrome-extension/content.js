// Content script for extracting webpage content
class ContentExtractor {
    constructor() {
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            // Handle ping check
            if (request.action === 'ping') {
                sendResponse({ success: true });
                return true;
            }
            
            if (request.action === 'extractContent') {
                this.extractContent()
                    .then(data => sendResponse({ success: true, data }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                return true; // Keep message channel open for async response
            }
        });
    }

    async extractContent() {
        try {
            // Wait for page to be fully loaded
            await this.waitForPageLoad();
            
            // Extract basic metadata
            const metadata = this.extractMetadata();
            
            // Try to extract main content using multiple methods
            let content = null;
            
            // Method 1: Try Readability.js if available
            if (window.Readability) {
                content = this.extractWithReadability();
            }
            
            // Method 2: Fallback to heuristic extraction
            if (!content || !content.textContent) {
                content = this.extractWithHeuristics();
            }
            
            // Method 3: Last resort - extract all text
            if (!content || !content.textContent) {
                content = this.extractAllText();
            }
            
            // Clean and process content
            const processedContent = this.processContent(content, metadata);
            
            // Log extraction
            this.logExtraction(metadata.url, processedContent);
            
            return processedContent;
            
        } catch (error) {
            console.error('Content extraction error:', error);
            throw new Error(`Failed to extract content: ${error.message}`);
        }
    }

    async waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve, { once: true });
            }
        });
    }

    extractMetadata() {
        const getMetaContent = (name) => {
            const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            return meta ? meta.getAttribute('content') : null;
        };

        return {
            title: document.title || '',
            url: window.location.href,
            description: getMetaContent('description') || '',
            author: getMetaContent('author') || getMetaContent('article:author') || '',
            publishedDate: getMetaContent('article:published_time') || getMetaContent('datePublished') || '',
            modifiedDate: getMetaContent('article:modified_time') || getMetaContent('dateModified') || '',
            siteName: getMetaContent('og:site_name') || getMetaContent('application-name') || '',
            language: document.documentElement.lang || 'en',
            keywords: getMetaContent('keywords') || '',
            canonicalUrl: this.getCanonicalUrl()
        };
    }

    getCanonicalUrl() {
        const canonical = document.querySelector('link[rel="canonical"]');
        return canonical ? canonical.href : window.location.href;
    }

    extractWithReadability() {
        try {
            const documentClone = document.cloneNode(true);
            const reader = new Readability(documentClone, {
                debug: false,
                maxElemsToParse: 0,
                nbTopCandidates: 5,
                charThreshold: 500,
                classesToPreserve: ['caption', 'emoji', 'hidden']
            });
            
            const article = reader.parse();
            
            if (article) {
                return {
                    title: article.title,
                    content: article.content,
                    textContent: article.textContent,
                    excerpt: article.excerpt,
                    byline: article.byline,
                    length: article.length,
                    siteName: article.siteName
                };
            }
        } catch (error) {
            console.warn('Readability extraction failed:', error);
        }
        
        return null;
    }

    extractWithHeuristics() {
        // Try to find main content using common selectors
        const contentSelectors = [
            'article',
            '[role="main"]',
            '.content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '.main-content',
            '#content',
            '#main',
            '.post',
            '.article'
        ];

        let mainElement = null;
        
        for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element && this.isValidContentElement(element)) {
                mainElement = element;
                break;
            }
        }

        if (!mainElement) {
            // Try to find the largest text block
            const textElements = Array.from(document.querySelectorAll('p, div, section, article'))
                .filter(el => this.isValidContentElement(el))
                .sort((a, b) => b.textContent.length - a.textContent.length);
            
            mainElement = textElements[0];
        }

        if (mainElement) {
            return {
                title: this.extractTitle(),
                content: mainElement.innerHTML,
                textContent: mainElement.textContent,
                excerpt: this.extractExcerpt(mainElement.textContent)
            };
        }

        return null;
    }

    isValidContentElement(element) {
        const text = element.textContent.trim();
        return text.length > 100 && 
               !element.querySelector('script') && 
               !element.querySelector('style') &&
               !element.classList.contains('advertisement') &&
               !element.classList.contains('ad') &&
               !element.classList.contains('sidebar') &&
               !element.classList.contains('navigation') &&
               !element.classList.contains('nav');
    }

    extractTitle() {
        // Try multiple title sources
        const titleSelectors = [
            'h1',
            '.title',
            '.post-title',
            '.article-title',
            '[data-title]'
        ];

        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return document.title || '';
    }

    extractExcerpt(text) {
        const sentences = text.split(/[.!?]+/);
        const firstSentence = sentences[0]?.trim();
        return firstSentence && firstSentence.length > 50 ? firstSentence : text.substring(0, 200) + '...';
    }

    extractAllText() {
        // Last resort - extract all visible text
        const bodyText = document.body.textContent || '';
        return {
            title: document.title || '',
            content: document.body.innerHTML,
            textContent: bodyText,
            excerpt: bodyText.substring(0, 200) + '...'
        };
    }

    processContent(content, metadata) {
        if (!content) {
            throw new Error('No content extracted');
        }

        // Clean text content
        const cleanText = this.cleanText(content.textContent || '');
        
        // Extract images
        const images = this.extractImages(content.content || '');
        
        // Extract links
        const links = this.extractLinks(content.content || '');

        return {
            ...metadata,
            ...content,
            textContent: cleanText,
            images: images,
            links: links,
            wordCount: this.countWords(cleanText),
            readingTime: this.calculateReadingTime(cleanText),
            extractedAt: new Date().toISOString()
        };
    }

    cleanText(text) {
        return text
            .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
            .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
            .trim();
    }

    extractImages(html) {
        const imgElements = document.querySelectorAll('img');
        return Array.from(imgElements).map(img => ({
            src: img.src,
            alt: img.alt || '',
            title: img.title || '',
            width: img.width || null,
            height: img.height || null
        })).filter(img => img.src && !img.src.startsWith('data:'));
    }

    extractLinks(html) {
        const linkElements = document.querySelectorAll('a[href]');
        return Array.from(linkElements).map(link => ({
            href: link.href,
            text: link.textContent.trim(),
            title: link.title || ''
        })).filter(link => link.href && link.text);
    }

    countWords(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const wordCount = this.countWords(text);
        return Math.ceil(wordCount / wordsPerMinute);
    }

    logExtraction(url, content) {
        const logData = {
            timestamp: new Date().toISOString(),
            url: url,
            title: content.title,
            wordCount: content.wordCount,
            hasImages: content.images.length > 0,
            hasLinks: content.links.length > 0,
            extractionMethod: content.extractionMethod || 'heuristic'
        };

        // Store in chrome storage for debugging
        chrome.storage.local.get(['extractionLogs'], (result) => {
            const logs = result.extractionLogs || [];
            logs.push(logData);
            
            // Keep only last 50 logs
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            chrome.storage.local.set({ extractionLogs: logs });
        });

        console.log('Content extraction logged:', logData);
    }
}

// Initialize content extractor
new ContentExtractor();
