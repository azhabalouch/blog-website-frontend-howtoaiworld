// Usage: node generate-rss.js
const fs = require('fs');
const path = require('path');

const BLOG_DATA_PATH = path.join(__dirname, 'api.json'); // Download your api.json here
const RSS_PATH = path.join(__dirname, 'rss.xml');

function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (c) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&apos;'}[c];
    });
}

function generateRSS(posts) {
    let items = '';
    posts.forEach(post => {
        items += `\n    <item>\n      <title>${escapeHtml(post.title)}</title>\n      <link>https://www.howtoaiworld.com/blog-post.html?id=${post.id}</link>\n      <description>${escapeHtml(post.excerpt || post.content || '')}</description>\n      <pubDate>${(new Date(post.date)).toUTCString()}</pubDate>\n      <guid>https://www.howtoaiworld.com/blog-post.html?id=${post.id}</guid>\n    </item>`;
    });
    return `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n  <channel>\n    <title>HowToAiWorld Blog</title>\n    <link>https://www.howtoaiworld.com/</link>\n    <description>Latest blogs and updates from HowToAiWorld</description>\n    <language>en-us</language>${items}\n  </channel>\n</rss>`;
}

function main() {
    if (!fs.existsSync(BLOG_DATA_PATH)) {
        console.error('api.json not found. Download your blog data as api.json.');
        process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf-8'));
    const posts = Array.isArray(data) ? data : (data.blogs || []);
    const rss = generateRSS(posts.slice(0, 20));
    fs.writeFileSync(RSS_PATH, rss, 'utf-8');
    console.log('RSS feed generated at rss.xml');
}

main();
