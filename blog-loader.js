// Blog display functionality
// RSS Feed Generation
async function generateRSSFeed() {
    await fetchBlogData();
    const posts = getRecentPosts(20); // Limit to 20 most recent
    let items = '';
    posts.forEach(post => {
        items += `\n    <item>\n      <title>${escapeHtml(post.title)}</title>\n      <link>https://www.howtoaiworld.com/blog-post.html?id=${post.id}</link>\n      <description>${escapeHtml(post.excerpt || post.content || '')}</description>\n      <pubDate>${(new Date(post.date)).toUTCString()}</pubDate>\n      <guid>https://www.howtoaiworld.com/blog-post.html?id=${post.id}</guid>\n    </item>`;
    });
    const rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n  <channel>\n    <title>HowToAiWorld Blog</title>\n    <link>https://www.howtoaiworld.com/</link>\n    <description>Latest blogs and updates from HowToAiWorld</description>\n    <language>en-us</language>${items}\n  </channel>\n</rss>`;
    // This would require server-side write access in production
    // For static sites, you must run this script locally and upload rss.xml
    return rss;
}
// This script loads and displays blogs from remote JSON

const BLOG_DATA_URL = 'https://azhabalouch.github.io/blogs-data-api/api.json';

let cachedPosts = [];
let dataLoaded = false;
let postsWithParsedDates = [];

// Fetch blog data from remote URL
async function fetchBlogData() {
    try {
        const response = await fetch(BLOG_DATA_URL, {
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch blog data`);
        
        const data = await response.json();
        
        // Handle both array format and object with blogs property
        if (Array.isArray(data)) {
            cachedPosts = data;
        } else if (data.blogs && Array.isArray(data.blogs)) {
            cachedPosts = data.blogs;
        } else {
            cachedPosts = [];
        }
        
        // Pre-parse and cache dates for better performance
        postsWithParsedDates = cachedPosts.map(post => ({
            ...post,
            parsedDate: parseDate(post.date)
        }));
        
        dataLoaded = true;
        //console.log(`✅ Loaded ${cachedPosts.length} posts from remote source`);
        return true;
    } catch (error) {
        //console.error('Error fetching blog data:', error);
        cachedPosts = [];
        postsWithParsedDates = [];
        dataLoaded = false;
        return false;
    }
}

// Get blog posts
function getBlogPosts() {
    return cachedPosts;
}

// Update blog stats (read-only now - stats come from remote)
function updateBlogStats(postId) {
    // Stats are managed remotely, no local updates
    //console.log(`Viewing post: ${postId}`);
}

// Get recent posts
function getRecentPosts(limit = 10) {
    if (postsWithParsedDates.length === 0) return [];
    return postsWithParsedDates
        .sort((a, b) => b.parsedDate - a.parsedDate)
        .slice(0, limit);
}

// Get featured posts - shows 3 most recent blogs (no featured tag needed)
function getFeaturedPosts(limit = 3) {
    if (postsWithParsedDates.length === 0) return [];
    return postsWithParsedDates
        .sort((a, b) => b.parsedDate - a.parsedDate)
        .slice(0, limit);
}

// Get post by ID
function getPostById(id) {
    if (!id || cachedPosts.length === 0) return null;
    return cachedPosts.find(post => post.id == id) || null;
}

// Parse date from various formats (handles "MM//DD//YYYY" format from API)
function parseDate(dateString) {
    if (dateString instanceof Date) return dateString;
    
    // Handle format: "12//19//2025"
    if (dateString && dateString.includes('//')) {
        const parts = dateString.split('//');
        if (parts.length === 3) {
            const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
            const day = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
    }
    
    // Fallback to standard date parsing
    try {
        return new Date(dateString);
    } catch (e) {
        return null;
    }
}

// Format date
const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
function formatDate(dateString) {
    try {
        const date = parseDate(dateString);
        if (!date) return dateString;
        return date.toLocaleDateString('en-US', dateFormatOptions);
    } catch (e) {
        return dateString;
    }
}

// Format date for datetime attribute
function formatDateTime(dateString) {
    try {
        const date = parseDate(dateString);
        if (!date) return '';
        return date.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Create blog article HTML
function createArticleHTML(post, isExcerpt = true) {
    if (!post || !post.id) return '';
    const content = isExcerpt ? post.excerpt : post.content;
    const readMoreLink = isExcerpt ? `<span class="read-more">Read More →</span>` : '';
    
    // Featured image HTML (only show on excerpts)
    const featuredImageHtml = isExcerpt && post.featured_image ? 
        `<div class="article-featured-image"><img src="${post.featured_image}" alt="${escapeHtml(post.title)}" /></div>` : '';
    
    return `
        <article class="blog-article" data-post-id="${post.id}">
            <a href="blog-post.html?id=${post.id}" class="article-card-link">
                <h3 class="article-title">${escapeHtml(post.title)}</h3>
                <div class="article-meta">
                    <span class="author">By ${escapeHtml(post.author)}</span>
                    <span class="separator">|</span>
                    <time datetime="${formatDateTime(post.parsedDate || post.date)}">${formatDate(post.parsedDate || post.date)}</time>
                    <span class="separator">|</span>
                    <span class="category-tag">${escapeHtml(post.category)}</span>
                </div>
                ${featuredImageHtml}
                <div class="article-content">
                    ${content}
                </div>
                ${readMoreLink}
            </a>
        </article>
    `;
}

// Load homepage blogs - Show featured (3 most recent) and all other recent blogs
function loadHomepageBlogs() {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles) return;
    
    const posts = getBlogPosts();
    
    // If no posts, show welcome message
    if (posts.length === 0) {
        mainArticles.innerHTML = `
            <article class="featured-article">
                <h2 class="article-title">Welcome to HowToAiWorld</h2>
                <div class="article-meta">
                    <span class="author">By Editorial Team</span>
                    <span class="separator">|</span>
                    <time datetime="2025-12-02">December 2, 2025</time>
                </div>
                <div class="article-content">
                    <p>Welcome to our newspaper-style blog platform. We bring you the latest news, insightful articles, and expert insights on topics that matter.</p>
                    <p>No blog posts have been published yet!</p>
                </div>
            </article>
        `;
        return;
    }
    
    const featuredPosts = getFeaturedPosts(3);
    const recentPosts = getRecentPosts(1000); // Get all posts
    
    // Track IDs to avoid duplicates
    const displayedIds = new Set();
    let html = '';
    
    // Featured Section (3 most recent posts)
    if (featuredPosts.length > 0) {
        html += '<h2 class="section-title">⭐ Featured Posts</h2>';
        featuredPosts.forEach((post, index) => {
            displayedIds.add(post.id);
            const badge = '<div class="featured-badge">⭐ Featured</div>';
            const featuredImageHtml = post.featured_image ? 
                `<div class="article-featured-image"><img src="${post.featured_image}" alt="${escapeHtml(post.title)}" /></div>` : '';
            html += `
                <article class="blog-article">
                    <a href="blog-post.html?id=${post.id}" class="article-card-link">
                        ${badge}
                        <h3 class="article-title">${escapeHtml(post.title)}</h3>
                        <div class="article-meta">
                            <span class="author">By ${escapeHtml(post.author)}</span>
                            <span class="separator">|</span>
                            <time datetime="${formatDateTime(post.parsedDate || post.date)}">${formatDate(post.parsedDate || post.date)}</time>
                            <span class="separator">|</span>
                            <span class="category-tag" data-category="${escapeHtml(post.category)}">${escapeHtml(post.category)}</span>
                        </div>
                        ${featuredImageHtml}
                        <div class="article-content">
                            ${post.excerpt}
                        </div>
                        <span class="read-more">Read More →</span>
                    </a>
                </article>
            `;
            if (index < featuredPosts.length - 1) html += '<div class="article-divider"></div>';
        });
        html += '<div class="article-divider"></div>';
    }
    
    // Recent Blogs Section - Exclude featured
    const uniqueRecent = recentPosts.filter(p => !displayedIds.has(p.id));
    if (uniqueRecent.length > 0) {
        html += '<h2 class="section-title">📰 Recent Posts</h2>';
        uniqueRecent.forEach((post, index) => {
            html += createArticleHTML(post, true);
            if (index < uniqueRecent.length - 1) html += '<div class="article-divider"></div>';
        });
    }
    
    mainArticles.innerHTML = html;
    
    // Update categories
    updateCategoriesSidebar();
    updatePopularCategories();
}

// Load recent blogs page
function loadRecentBlogsPage() {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles || !mainArticles.querySelector('h2')?.textContent.includes('Recent Blog Posts')) return;
    
    const posts = getRecentPosts(20);
    
    let html = '<h2 class="article-title">Recent Blog Posts</h2>';
    
    posts.forEach((post, index) => {
        html += createArticleHTML(post, true);
        if (index < posts.length - 1) html += '<div class="article-divider"></div>';
    });
    
    if (posts.length === 0) {
        html += '<p>No blog posts available yet. Check back soon!</p>';
    }
    
    mainArticles.innerHTML = html;
}

// Load featured blogs page - show 3 most recent blogs
function loadFeaturedBlogsPage() {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles) return;
    
    const posts = getFeaturedPosts(3);
    
    let html = `
        <h2 class="article-title">Featured Articles</h2>
        <p class="subtitle">Our latest 3 most recent articles on HowToAiWorld.</p>
    `;
    
    posts.forEach((post, index) => {
        const badge = '<div class="featured-badge">⭐ Featured</div>';
        const featuredImageHtml = post.featured_image ? 
            `<div class="article-featured-image"><img src="${post.featured_image}" alt="${escapeHtml(post.title)}" /></div>` : '';
        
        html += `
            <article class="blog-article">
                <a href="blog-post.html?id=${post.id}" class="article-card-link">
                    ${badge}
                    <h3 class="article-title">${escapeHtml(post.title)}</h3>
                    <div class="article-meta">
                        <span class="author">By ${escapeHtml(post.author)}</span>
                        <span class="separator">|</span>
                        <time datetime="${formatDateTime(post.parsedDate || post.date)}">${formatDate(post.parsedDate || post.date)}</time>
                        <span class="separator">|</span>
                        <span>${escapeHtml(post.category)}</span>
                    </div>
                    ${featuredImageHtml}
                    <div class="article-content">
                        ${post.excerpt}
                    </div>
                    <span class="read-more">Read More →</span>
                </a>
            </article>
        `;
        if (index < posts.length - 1) html += '<div class="article-divider"></div>';
    });
    
    if (posts.length === 0) {
        html += '<p>No articles available yet. Check back soon!</p>';
    }
    
    mainArticles.innerHTML = html;
    
    // Update sidebar
    updateCategoriesSidebar();
    updatePopularCategories();
}

// Get all unique categories with counts
function getCategoriesWithCounts() {
    const categoryCounts = {};
    cachedPosts.forEach(post => {
        const category = post.category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

// Update categories sidebar with dynamic counts
function updateCategoriesSidebar() {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;
    
    const categories = getCategoriesWithCounts();
    
    if (categories.length === 0) {
        categoriesList.innerHTML = '<li><a href="index.html">All Posts</a></li>';
        return;
    }
    
    let html = '<li><a href="index.html">All Posts</a></li>';
    categories.forEach(cat => {
        html += `<li><a href="index.html?category=${encodeURIComponent(cat.name)}">${escapeHtml(cat.name)} (${cat.count})</a></li>`;
    });
    
    categoriesList.innerHTML = html;
}

// Update popular categories with counts
function updatePopularCategories() {
    const popularList = document.getElementById('popular-categories');
    if (!popularList) return;
    
    const categories = getCategoriesWithCounts().slice(0, 4);
    
    if (categories.length === 0) {
        popularList.innerHTML = '<li class="empty-state">No categories yet</li>';
        return;
    }
    
    popularList.innerHTML = categories.map(cat => `<li class="category-item"><a href="index.html?category=${encodeURIComponent(cat.name)}" class="category-link"><span>${escapeHtml(cat.name)}</span><span class="count">${cat.count}</span></a></li>`).join('');
}

// Get posts by category
function getPostsByCategory(category, limit = 50) {
    if (!category || postsWithParsedDates.length === 0) return [];
    return postsWithParsedDates
        .filter(post => post.category && post.category.toLowerCase() === category.toLowerCase())
        .sort((a, b) => b.parsedDate - a.parsedDate)
        .slice(0, limit);
}

// Load homepage with optional category filter
function loadHomepageWithFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        loadCategoryPage(category);
    } else {
        loadHomepageBlogs();
    }
}

// Load category filtered page
function loadCategoryPage(category) {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles) return;
    
    const posts = getPostsByCategory(category);
    
    let html = `<h2 class="section-title">📂 ${escapeHtml(category)} (${posts.length} posts)</h2>`;
    html += `<p class="back-link"><a href="index.html">← Back to all posts</a></p>`;
    
    if (posts.length === 0) {
        html += '<p>No posts found in this category.</p>';
    } else {
        posts.forEach((post, index) => {
            html += createArticleHTML(post, true);
            if (index < posts.length - 1) html += '<div class="article-divider"></div>';
        });
    }
    
    mainArticles.innerHTML = html;
    updateCategoriesSidebar();
    updatePopularCategories();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Fetch blog data first
    await fetchBlogData();
    
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || path.split('\\').pop();
    
    // Check if we're on homepage (index.html, empty, or root)
    if (currentPage === 'index.html' || currentPage === '' || path.endsWith('/') || path === '/') {
        loadHomepageWithFilter();
    } else if (currentPage === 'recent-blogs.html') {
        loadRecentBlogsPage();
    } else if (currentPage === 'featured.html') {
        loadFeaturedBlogsPage();
    } else if (currentPage === 'blog-post.html') {
        loadBlogPost();
    }
});