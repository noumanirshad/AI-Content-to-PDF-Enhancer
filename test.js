// Simple test script for content extraction
(async () => {
    const testUrls = [
        'https://en.wikipedia.org/wiki/Artificial_intelligence',
        'https://www.bbc.com/news',
        'https://medium.com/@example/sample-article'
    ];
    
    for (const url of testUrls) {
        console.log(`Testing: ${url}`);
        
        // Simulate content extraction
        const response = await fetch(url);
        const html = await response.text();
        
        // Check if main content can be identified
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const article = doc.querySelector('article, main, [role="main"]');
        
        if (article) {
            console.log(`✓ Main content found: ${article.textContent.substring(0, 100)}...`);
        } else {
            console.log(`✗ No main content identified`);
        }
    }
})();