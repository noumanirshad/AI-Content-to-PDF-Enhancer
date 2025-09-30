// Simplified Readability.js implementation
// This is a basic version for content extraction

class Readability {
    constructor(doc, options = {}) {
        this.doc = doc;
        this.options = {
            debug: false,
            maxElemsToParse: 0,
            nbTopCandidates: 5,
            charThreshold: 500,
            classesToPreserve: ['caption', 'emoji', 'hidden'],
            ...options
        };
    }

    parse() {
        try {
            // Remove unwanted elements
            this.removeUnwantedElements();
            
            // Find the main content
            const article = this.findMainContent();
            
            if (!article) {
                return null;
            }

            // Extract metadata
            const metadata = this.extractMetadata();
            
            // Clean up the content
            this.cleanContent(article);
            
            return {
                title: metadata.title,
                content: article.innerHTML,
                textContent: article.textContent,
                excerpt: this.extractExcerpt(article.textContent),
                byline: metadata.byline,
                length: article.textContent.length,
                siteName: metadata.siteName
            };
        } catch (error) {
            console.error('Readability parsing error:', error);
            return null;
        }
    }

    removeUnwantedElements() {
        const unwantedSelectors = [
            'script',
            'style',
            'nav',
            'header',
            'footer',
            '.advertisement',
            '.ad',
            '.sidebar',
            '.navigation',
            '.menu',
            '.social',
            '.share',
            '.comments',
            '.comment',
            '.related',
            '.recommended',
            '.popup',
            '.modal',
            '.overlay'
        ];

        unwantedSelectors.forEach(selector => {
            const elements = this.doc.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    }

    findMainContent() {
        // Try different strategies to find main content
        const strategies = [
            () => this.findByArticleTag(),
            () => this.findByMainTag(),
            () => this.findByContentClass(),
            () => this.findByHeuristics()
        ];

        for (const strategy of strategies) {
            const content = strategy();
            if (content && this.isValidContent(content)) {
                return content;
            }
        }

        return null;
    }

    findByArticleTag() {
        return this.doc.querySelector('article');
    }

    findByMainTag() {
        return this.doc.querySelector('main');
    }

    findByContentClass() {
        const contentClasses = [
            '.content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '.main-content',
            '.post',
            '.article'
        ];

        for (const className of contentClasses) {
            const element = this.doc.querySelector(className);
            if (element) {
                return element;
            }
        }

        return null;
    }

    findByHeuristics() {
        // Find the element with the most text content
        const candidates = Array.from(this.doc.querySelectorAll('div, section, article, main'))
            .filter(el => this.isValidContent(el))
            .sort((a, b) => b.textContent.length - a.textContent.length);

        return candidates[0] || null;
    }

    isValidContent(element) {
        const text = element.textContent.trim();
        return text.length > this.options.charThreshold &&
               !element.querySelector('script') &&
               !element.querySelector('style') &&
               !this.isUnwantedElement(element);
    }

    isUnwantedElement(element) {
        const unwantedClasses = [
            'advertisement', 'ad', 'sidebar', 'navigation', 'menu',
            'social', 'share', 'comments', 'comment', 'related',
            'recommended', 'popup', 'modal', 'overlay'
        ];

        return unwantedClasses.some(className => 
            element.classList.contains(className) ||
            element.id.includes(className)
        );
    }

    extractMetadata() {
        const getMetaContent = (name) => {
            const meta = this.doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            return meta ? meta.getAttribute('content') : null;
        };

        return {
            title: this.doc.title || this.extractTitleFromContent(),
            byline: getMetaContent('author') || getMetaContent('article:author'),
            siteName: getMetaContent('og:site_name') || getMetaContent('application-name')
        };
    }

    extractTitleFromContent() {
        const titleSelectors = ['h1', '.title', '.post-title', '.article-title'];
        
        for (const selector of titleSelectors) {
            const element = this.doc.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return '';
    }

    extractExcerpt(text) {
        const sentences = text.split(/[.!?]+/);
        const firstSentence = sentences[0]?.trim();
        return firstSentence && firstSentence.length > 50 ? firstSentence : text.substring(0, 200) + '...';
    }

    cleanContent(element) {
        // Remove empty elements
        const emptyElements = element.querySelectorAll('p, div, span');
        emptyElements.forEach(el => {
            if (!el.textContent.trim() && !el.querySelector('img, br')) {
                el.remove();
            }
        });

        // Clean up whitespace
        const walker = this.doc.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(node => {
            node.textContent = node.textContent.replace(/\s+/g, ' ').trim();
        });
    }
}

// Make Readability available globally
if (typeof window !== 'undefined') {
    window.Readability = Readability;
}
