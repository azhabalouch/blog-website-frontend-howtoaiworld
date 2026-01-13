// Blog display functionality
// This script loads and displays blogs from remote JSON

const BLOG_DATA_URL = 'https://azhabalouch.github.io/blog-data/blogs_data.json';

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
        cachedPosts = Array.isArray(data) ? data : (data.posts || []);
        
        // Pre-parse and cache dates for better performance
        postsWithParsedDates = cachedPosts.map(post => ({
            ...post,
            parsedDate: new Date(post.date)
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

// Get trending posts
function getTrendingPosts(limit = 10) {
    if (postsWithParsedDates.length === 0) return [];
    return postsWithParsedDates
        .filter(post => post.trending === true)
        .sort((a, b) => b.parsedDate - a.parsedDate)
        .slice(0, limit);
}

// Get featured posts
function getFeaturedPosts(limit = 5) {
    if (postsWithParsedDates.length === 0) return [];
    return postsWithParsedDates
        .filter(post => post.featured === true)
        .sort((a, b) => b.parsedDate - a.parsedDate)
        .slice(0, limit);
}

// Get post by ID
function getPostById(id) {
    if (!id || cachedPosts.length === 0) return null;
    return cachedPosts.find(post => post.id == id) || null;
}

// Format date
const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
function formatDate(dateString) {
    try {
        const date = dateString instanceof Date ? dateString : new Date(dateString);
        return date.toLocaleDateString('en-US', dateFormatOptions);
    } catch (e) {
        return dateString;
    }
}

// Format date for datetime attribute
function formatDateTime(dateString) {
    try {
        const date = dateString instanceof Date ? dateString : new Date(dateString);
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
    const readMoreLink = isExcerpt ? `<a href="blog-post.html?id=${post.id}" class="read-more">Read More →</a>` : '';
    
    return `
        <article class="blog-article" data-post-id="${post.id}">
            <h3 class="article-title">${escapeHtml(post.title)}</h3>
            <div class="article-meta">
                <span class="author">By ${escapeHtml(post.author)}</span>
                <span class="separator">|</span>
                <time datetime="${formatDateTime(post.parsedDate || post.date)}">${formatDate(post.parsedDate || post.date)}</time>
                <span class="separator">|</span>
                <a href="index.html?category=${encodeURIComponent(post.category)}" class="category-tag" style="color: #c41e3a; text-decoration: none; font-weight: bold;">${escapeHtml(post.category)}</a>
            </div>
            <div class="article-content">
                ${content}
            </div>
            ${readMoreLink}
        </article>
    `;
}

// Load homepage blogs - Show trending, featured, and all recent blogs
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
                    <p>Welcome to our newspaper-style blog platform. We bring you the latest news, trending stories, and insightful articles on topics that matter.</p>
                    <p>No blog posts have been published yet!</p>
                </div>
            </article>
        `;
        return;
    }
    
    const featuredPosts = getFeaturedPosts(100);
    const recentPosts = getRecentPosts(1000); // Get all posts
    
    // Track IDs to avoid duplicates
    const displayedIds = new Set();
    let html = '';
    
    // Featured Section
    if (featuredPosts.length > 0) {
        html += '<h2 class="section-title" style="font-size: 28px; margin-bottom: 20px; color: #ff6b35; border-bottom: 3px solid #ff6b35; padding-bottom: 10px;">⭐ Featured Posts</h2>';
        featuredPosts.forEach((post, index) => {
            displayedIds.add(post.id);
            const badge = '<div style="background-color: #ff6b35; color: #fff; display: inline-block; padding: 5px 12px; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">⭐ Featured</div>';
            html += `
                <article class="blog-article">
                    ${badge}
                    <h3 class="article-title">${escapeHtml(post.title)}</h3>
                    <div class="article-meta">
                        <span class="author">By ${escapeHtml(post.author)}</span>
                        <span class="separator">|</span>
                        <time datetime="${formatDateTime(post.parsedDate || post.date)}">${formatDate(post.parsedDate || post.date)}</time>
                        <span class="separator">|</span>
                        <span class="category-tag" data-category="${escapeHtml(post.category)}">${escapeHtml(post.category)}</span>
                    </div>
                    <div class="article-content">
                        ${post.excerpt}
                    </div>
                    <a href="blog-post.html?id=${post.id}" class="read-more">Read More →</a>
                </article>
            `;
            if (index < featuredPosts.length - 1) html += '<div class="article-divider"></div>';
        });
        html += '<div class="article-divider" style="margin: 40px 0;"></div>';
    }
    
    // Recent Blogs Section - Exclude featured
    const uniqueRecent = recentPosts.filter(p => !displayedIds.has(p.id));
    if (uniqueRecent.length > 0) {
        html += '<h2 class="section-title" style="font-size: 28px; margin-bottom: 20px; color: #2c2c2c; border-bottom: 3px solid #2c2c2c; padding-bottom: 10px;">📰 Recent Posts</h2>';
        uniqueRecent.forEach((post, index) => {
            html += createArticleHTML(post, true);
            if (index < uniqueRecent.length - 1) html += '<div class="article-divider"></div>';
        });
    }
    
    mainArticles.innerHTML = html;
    
    // Update trending sidebar and categories
    updateTrendingSidebar();
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

// Load trending blogs page
function loadTrendingBlogsPage() {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles) return;
    
    const posts = getTrendingPosts(100);
    
    let html = `
        <h2 class="article-title">Trending Now</h2>
        <p style="margin-bottom: 30px; font-style: italic; color: #666;">The most popular articles our readers are engaging with right now.</p>
    `;
    
    posts.forEach((post, index) => {
        const badge = index === 0 ? 
            '<div style="background-color: #c41e3a; color: #fff; display: inline-block; padding: 5px 12px; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">🔥 Most Popular</div>' :
            index < 3 ? '<div style="background-color: #ff6b35; color: #fff; display: inline-block; padding: 5px 12px; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">⚡ Trending</div>' : '';
        
        html += `
            <article class="blog-article">
                ${badge}
                <h3 class="article-title">${escapeHtml(post.title)}</h3>
                <div class="article-meta">
                    <span class="author">By ${escapeHtml(post.author)}</span>
                    <span class="separator">|</span>
                    <time datetime="${formatDateTime(post.parsedDate || post.date)}">${formatDate(post.parsedDate || post.date)}</time>
                    <span class="separator">|</span>
                    <span>${escapeHtml(post.category)}</span>
                </div>
                <div class="article-content">
                    ${post.excerpt}
                </div>
                <a href="blog-post.html?id=${post.id}" class="read-more">Read More →</a>
            </article>
        `;
        if (index < posts.length - 1) html += '<div class="article-divider"></div>';
    });
    
    if (posts.length === 0) {
        html += '<p>No trending posts available yet. Check back soon!</p>';
    }
    
    mainArticles.innerHTML = html;
    
    // Update popular categories sidebar
    updatePopularCategories();
}

// Update trending sidebar
function updateTrendingSidebar() {
    const trendingList = document.querySelector('.trending-list');
    if (!trendingList) return;
    
    const posts = getTrendingPosts(5);
    
    if (posts.length === 0) {
        trendingList.innerHTML = '<li style="color: #666;">No trending posts yet</li>';
        return;
    }
    
    trendingList.innerHTML = posts.map(post => 
        `<li><a href="blog-post.html?id=${post.id}">${escapeHtml(post.title)}</a></li>`
    ).join('');
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
        popularList.innerHTML = '<li style="color: #666; padding: 10px 0;">No categories yet</li>';
        return;
    }
    
    popularList.innerHTML = categories.map(cat => `<li style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="index.html?category=${encodeURIComponent(cat.name)}" style="color: #2c2c2c; text-decoration: none; display: flex; justify-content: space-between;"><span>${escapeHtml(cat.name)}</span><span style="color: #c41e3a; font-weight: bold;">${cat.count}</span></a></li>`).join('');
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
    
    let html = `<h2 class="section-title" style="font-size: 28px; margin-bottom: 20px; color: #2c2c2c; border-bottom: 3px solid #2c2c2c; padding-bottom: 10px;">📂 ${escapeHtml(category)} (${posts.length} posts)</h2>`;
    html += `<p style="margin-bottom: 30px;"><a href="index.html" style="color: #c41e3a;">← Back to all posts</a></p>`;
    
    if (posts.length === 0) {
        html += '<p>No posts found in this category.</p>';
    } else {
        posts.forEach((post, index) => {
            html += createArticleHTML(post, true);
            if (index < posts.length - 1) html += '<div class="article-divider"></div>';
        });
    }
    
    mainArticles.innerHTML = html;
    updateTrendingSidebar();
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
    } else if (currentPage === 'trending.html') {
        loadTrendingBlogsPage();
    } else if (currentPage === 'blog-post.html') {
        loadBlogPost();
    }
});