// Blog display functionality
// This script loads and displays blogs from remote JSON

const BLOG_DATA_URL = 'https://azhabalouch.github.io/blogs-data-api/api.json';

let cachedPosts = [];
let dataLoaded = false;
let postsWithParsedDates = [];

// Pagination state
let currentPage = 1;
const postsPerPage = 7;

// Search and filter state
let filteredPosts = [];
let currentSearchTerm = '';
let currentCategoryFilter = '';

// Lazy loading state
let intersectionObserver = null;

// Trigger sidebar updates if elements exist
function triggerSidebarUpdates() {
    if (!dataLoaded) return;
    
    requestAnimationFrame(function() {
        if (document.getElementById('featured-blogs-list')) {
            updateFeaturedSidebar();
        }
        if (document.getElementById('popular-categories')) {
            updatePopularCategories();
        }
        if (document.getElementById('categories-list')) {
            updateCategoriesSidebar();
        }
    });
}

// Fetch blog data from remote URL with caching
async function fetchBlogData() {
    try {
        // Check if data is cached in sessionStorage
        const cachedData = sessionStorage.getItem('blogData');
        const cacheTime = sessionStorage.getItem('blogDataTime');
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        
        if (cachedData && cacheTime) {
            const age = Date.now() - parseInt(cacheTime);
            if (age < CACHE_DURATION) {
                const data = JSON.parse(cachedData);
                if (Array.isArray(data)) {
                    cachedPosts = data;
                } else if (data.blogs && Array.isArray(data.blogs)) {
                    cachedPosts = data.blogs;
                }
                
                postsWithParsedDates = cachedPosts.map(post => ({
                    ...post,
                    parsedDate: parseDate(post.date)
                }));
                
                dataLoaded = true;
                initializeLazyLoading();
                
                // Trigger sidebar updates in case they loaded before data
                triggerSidebarUpdates();
                
                return true;
            }
        }
        
        const response = await fetch(BLOG_DATA_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch blog data`);
        
        const data = await response.json();
        
        // Cache the data
        sessionStorage.setItem('blogData', JSON.stringify(data));
        sessionStorage.setItem('blogDataTime', Date.now().toString());
        
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
        initializeLazyLoading();
        
        // Trigger sidebar updates in case they loaded before data
        triggerSidebarUpdates();
        
        return true;
    } catch (error) {
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

// Create blog article HTML with lazy loading for images
function createArticleHTML(post, isExcerpt = true) {
    if (!post || !post.id) return '';
    const content = isExcerpt ? post.excerpt : post.content;
    const readMoreLink = isExcerpt ? `<span class="read-more">Continue Reading →</span>` : '';
    const readingTime = calculateReadingTime(post.content || post.excerpt);
    
    // Featured image HTML with lazy loading
    const featuredImageHtml = isExcerpt && post.featured_image ? 
        `<div class="article-featured-image">
            <img data-src="${post.featured_image}" 
                 alt="${escapeHtml(post.title)}" 
                 class="lazy-image" 
                 loading="lazy" />
        </div>` : '';
    
    return `
        <article class="blog-article" data-post-id="${post.id}">
            <a href="/pages/blog-post/?id=${post.id}" class="article-card-link">
                <h3 class="article-title">${escapeHtml(post.title)}</h3>
                <div class="article-meta">
                    <span class="author">By ${escapeHtml(post.author)}</span>
                    <span class="separator">•</span>
                    <time datetime="${formatDateTime(post.parsedDate || post.date)}">${formatDate(post.parsedDate || post.date)}</time>
                    <span class="separator">•</span>
                    <span class="reading-time">${readingTime}</span>
                    <span class="separator">•</span>
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

// Calculate reading time based on word count
function calculateReadingTime(content) {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

// Load homepage blogs - Show featured (3 most recent) and all other recent blogs with pagination
function loadHomepageBlogs(page = 1) {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles) return;
    
    const posts = getBlogPosts();
    
    // If no posts, show welcome message
    if (posts.length === 0) {
        mainArticles.innerHTML = `
            <article class="featured-article">
                <h2 class="article-title">Welcome to Howtoaiworld</h2>
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
        hidePagination();
        return;
    }
    
    currentPage = page;
    const recentPosts = getRecentPosts(1000); // Get all posts
    let html = '';
    
    if (currentPage === 1) {
        // Page 1: Show 7 recent blogs (no featured section to avoid duplication)
        html += '<h2 class="section-title">Latest Articles</h2>';
        
        const postsToDisplay = recentPosts.slice(0, postsPerPage);
        if (postsToDisplay.length > 0) {
            postsToDisplay.forEach((post, index) => {
                html += createArticleHTML(post, true);
                if (index < postsToDisplay.length - 1) html += '<div class="article-divider"></div>';
            });
        }
        
        // Calculate total pages: all pages show 7 posts
        const totalPages = Math.ceil(recentPosts.length / postsPerPage);
        
        mainArticles.innerHTML = html;
        updatePaginationControls(currentPage, totalPages);
        
    } else {
        // Page 2+: Show 7 recent blogs
        const skipCount = (currentPage - 1) * postsPerPage;
        const postsToDisplay = recentPosts.slice(skipCount, skipCount + postsPerPage);
        
        html += '<h2 class="section-title">Latest Articles</h2>';
        
        if (postsToDisplay.length > 0) {
            postsToDisplay.forEach((post, index) => {
                html += createArticleHTML(post, true);
                if (index < postsToDisplay.length - 1) html += '<div class="article-divider"></div>';
            });
        }
        
        // Calculate total pages
        const totalPages = Math.ceil(recentPosts.length / postsPerPage);
        
        mainArticles.innerHTML = html;
        updatePaginationControls(currentPage, totalPages);
        
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Sidebar will be updated automatically via sidebarComponentLoaded events
    
    // Apply lazy loading to images
    observeLazyImages();
}

// Update pagination controls
function updatePaginationControls(page, totalPages) {
    const paginationControls = document.getElementById('pagination-controls');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    if (!paginationControls || totalPages <= 1) {
        hidePagination();
        return;
    }
    
    // Show pagination controls
    paginationControls.style.display = 'flex';
    
    // Update page info
    pageInfo.textContent = `Page ${page} of ${totalPages}`;
    
    // Enable/disable buttons
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;
    
    // Remove old event listeners by cloning
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    // Add new event listeners
    newPrevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            loadHomepageBlogs(currentPage - 1);
        }
    });
    
    newNextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadHomepageBlogs(currentPage + 1);
        }
    });
}

// Hide pagination controls
function hidePagination() {
    const paginationControls = document.getElementById('pagination-controls');
    if (paginationControls) {
        paginationControls.style.display = 'none';
    }
}

// Load featured blogs page - show 3 most recent blogs
function loadFeaturedBlogsPage() {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles) return;
    
    // Check if data loaded successfully
    if (!dataLoaded || cachedPosts.length === 0) {
        mainArticles.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 60px 20px;">
                <h2 style="color: #d32f2f; margin-bottom: 16px;">⚠️ Error Loading Blogs</h2>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px;">An error occurred while loading the featured articles. Please try refreshing the page.</p>
                <button onclick="window.location.reload()" style="padding: 12px 24px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Refresh Page</button>
            </div>
        `;
        return;
    }
    
    const posts = getFeaturedPosts(3);
    
    let html = '<h2 class="section-title">Featured Articles</h2>';
    
    if (posts.length === 0) {
        html += '<p style="text-align: center; padding: 40px 20px; color: #666;">No featured articles available yet. Check back soon!</p>';
    } else {
        posts.forEach((post, index) => {
            const readingTime = calculateReadingTime(post.content || post.excerpt);
            
            // Use lazy loading for images - consistent with homepage
            const featuredImageHtml = post.featured_image ? 
                `<div class="article-featured-image">
                    <img data-src="${post.featured_image}" 
                         alt="${escapeHtml(post.title)}" 
                         class="lazy-image" 
                         loading="lazy" />
                </div>` : '';
            
            html += `
                <article class="blog-article" data-post-id="${post.id}">
                    <a href="/pages/blog-post/?id=${post.id}" class="article-card-link">
                        <h3 class="article-title">${escapeHtml(post.title)}</h3>
                        <div class="article-meta">
                            <span class="author">By ${escapeHtml(post.author)}</span>
                            <span class="separator">•</span>
                            <time datetime="${formatDateTime(post.parsedDate || post.date)}">${formatDate(post.parsedDate || post.date)}</time>
                            <span class="separator">•</span>
                            <span class="reading-time">${readingTime}</span>
                            <span class="separator">•</span>
                            <span class="category-tag">${escapeHtml(post.category)}</span>
                        </div>
                        ${featuredImageHtml}
                        <div class="article-content">
                            ${post.excerpt}
                        </div>
                        <span class="read-more">Continue Reading →</span>
                    </a>
                </article>
            `;
            if (index < posts.length - 1) html += '<div class="article-divider"></div>';
        });
    }
    
    mainArticles.innerHTML = html;
    
    // Sidebar will be updated automatically via sidebarComponentLoaded events
    
    // Apply lazy loading to images
    observeLazyImages();
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
        categoriesList.innerHTML = '<li><a href="/">All Posts</a></li>';
        return;
    }
    
    let html = '<li><a href="/">All Posts</a></li>';
    categories.forEach(cat => {
        html += `<li><a href="/?category=${encodeURIComponent(cat.name)}">${escapeHtml(cat.name)} (${cat.count})</a></li>`;
    });
    
    categoriesList.innerHTML = html;
}

// Update popular categories with counts
function updatePopularCategories() {
    const popularList = document.getElementById('popular-categories');
    if (!popularList) return;
    
    // Only show categories with 5 or more posts (truly popular)
    const MIN_POSTS_THRESHOLD = 5;
    const categories = getCategoriesWithCounts()
        .filter(cat => cat.count >= MIN_POSTS_THRESHOLD)
        .slice(0, 4);
    
    if (categories.length === 0) {
        popularList.innerHTML = '<li class="empty-state">No popular categories yet</li>';
        return;
    }
    
    popularList.innerHTML = categories.map(cat => `<li class="category-item"><a href="/?category=${encodeURIComponent(cat.name)}" class="category-link"><span>${escapeHtml(cat.name)}</span><span class="count">${cat.count}</span></a></li>`).join('');
}

// Update featured blogs sidebar
function updateFeaturedSidebar() {
    const featuredList = document.getElementById('featured-blogs-list');
    if (!featuredList) return;
    
    const featured = getFeaturedPosts(3); // Get top 3 featured posts
    
    if (featured.length === 0) {
        featuredList.innerHTML = '<li class="empty-state">No featured posts yet</li>';
        return;
    }
    
    featuredList.innerHTML = featured.map((post, index) => `
        <li class="featured-item">
            <a href="/pages/blog-post/?id=${post.id}" class="featured-link">
                <span class="featured-number">${index + 1}</span>
                <div class="featured-content">
                    <h4 class="featured-title">${escapeHtml(post.title)}</h4>
                    <div class="featured-meta">
                        <span class="featured-category">${escapeHtml(post.category)}</span>
                        <span class="featured-date">${formatDate(post.parsedDate || post.date)}</span>
                    </div>
                </div>
            </a>
        </li>
    `).join('');
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
    html += `<p class="back-link"><a href="/">← Back to all posts</a></p>`;
    
    if (posts.length === 0) {
        html += '<p>No posts found in this category.</p>';
    } else {
        posts.forEach((post, index) => {
            html += createArticleHTML(post, true);
            if (index < posts.length - 1) html += '<div class="article-divider"></div>';
        });
    }
    
    mainArticles.innerHTML = html;
    // Sidebar will be updated automatically via sidebarComponentLoaded events
}

// Detect current page from URL path
function detectCurrentPage() {
    const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    const segments = path.split('/').filter(Boolean);
    // Return the last meaningful segment, or 'home' for root
    if (segments.length === 0) return 'home';
    return segments[segments.length - 1];
}

// Load individual blog post
async function loadBlogPost() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) {
            window.location.href = '/';
            return;
        }
        
        // Wait for blog data to load if not already loaded
        if (!dataLoaded) {
            const success = await fetchBlogData();
            if (!success) {
                document.getElementById('blog-post-container').innerHTML = `
                    <div style="text-align: center; padding: 60px 20px;">
                        <h2 style="font-size: 32px; margin-bottom: 20px;">Error Loading Post</h2>
                        <p style="font-size: 18px; color: #666; margin-bottom: 30px;">Unable to load blog data. Please try again later.</p>
                        <a href="/" style="display: inline-block; padding: 15px 30px; background-color: #2c2c2c; color: #fff; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Go to Homepage</a>
                    </div>
                `;
                return;
            }
        }
        
        const post = getPostById(postId);
        
        if (!post) {
            document.getElementById('blog-post-container').innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <h2 style="font-size: 32px; margin-bottom: 20px;">Post Not Found</h2>
                    <p style="font-size: 18px; color: #666; margin-bottom: 30px;">Sorry, the article you're looking for doesn't exist.</p>
                    <a href="/" style="display: inline-block; padding: 15px 30px; background-color: #2c2c2c; color: #fff; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Go to Homepage</a>
                </div>
            `;
            return;
        }
        
        // Update page title and meta
        document.getElementById('page-title').textContent = `${post.title} - Howtoaiworld`;
        document.querySelector('meta[name="description"]').setAttribute('content', post.excerpt);
        
        // Create article container
        const article = document.createElement('article');
        article.className = 'featured-article';
    
        // Featured image HTML
        const featuredImageHtml = post.featured_image ? 
            `<div class="article-featured-image" style="margin-bottom: 30px; text-align: center;"><img src="${post.featured_image}" alt="${escapeHtml(post.title)}" style="max-width: 100%; height: auto; border-radius: 8px;" /></div>` : '';
        
        // Build article HTML
        article.innerHTML = `
            <h1 class="article-title">${escapeHtml(post.title)}</h1>
            <div class="article-meta">
                <span class="author">By ${escapeHtml(post.author)}</span>
                <span class="separator">|</span>
                <time datetime="${formatDateTime(post.date)}">${formatDate(post.date)}</time>
                <span class="separator">|</span>
                <a href="/?category=${encodeURIComponent(post.category)}" style="color: #c41e3a; text-decoration: none; font-weight: bold;">${escapeHtml(post.category)}</a>
            </div>
            ${featuredImageHtml}
            <div class="article-content">
            </div>
            <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #ddd;">
                <a href="/" class="back-to-posts-link">← Back to All Posts</a>
            </div>
        `;
        
        // Set content HTML separately to preserve formatting
        const contentDiv = article.querySelector('.article-content');
        let contentHtml = post.content;
        
        // Remove the first h1 tag from content to avoid duplication
        if (contentHtml) {
            contentHtml = contentHtml.replace(/<h1[^>]*>.*?<\/h1>/, '');
        }
        
        // Handle content images
        if (post.content_images && Array.isArray(post.content_images) && post.content_images.length > 0) {
            if (post.content_images.length >= 1) {
                const tempWrapper = document.createElement('div');
                tempWrapper.innerHTML = contentHtml || '';
                const paragraphs = tempWrapper.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    const midIndex = Math.floor(paragraphs.length / 2);
                    const imageMarkup = `<figure class="content-inline-image"><img src="${post.content_images[0]}" alt="${escapeHtml(post.title)} image 1"></figure>`;
                    const imageContainer = document.createElement('div');
                    imageContainer.innerHTML = imageMarkup;
                    paragraphs[midIndex].insertAdjacentElement('afterend', imageContainer);
                }
                contentHtml = tempWrapper.innerHTML;
            }
        }
        
        contentDiv.innerHTML = contentHtml;
        
        // Add second image at the end if exists
        if (post.content_images && Array.isArray(post.content_images) && post.content_images.length >= 2) {
            const secondImageMarkup = `<figure class="content-inline-image"><img src="${post.content_images[1]}" alt="${escapeHtml(post.title)} image 2"></figure>`;
            const secondImageDiv = document.createElement('div');
            secondImageDiv.innerHTML = secondImageMarkup;
            contentDiv.appendChild(secondImageDiv);
        }
        
        // Add FAQ section if it exists
        const faqItems = post.faq || post.FAQ;
        if (faqItems && Array.isArray(faqItems) && faqItems.length > 0) {
            const faqDiv = document.createElement('div');
            faqDiv.className = 'article-faq';
            
            const faqList = faqItems.map((item, idx) => {
                const q = escapeHtml(item.question || 'Question');
                const a = escapeHtml(item.answer || '');
                return `
                    <div class="faq-item" data-index="${idx}">
                        <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${idx}">
                            <span class="faq-question-text">${q}</span>
                            <span class="faq-toggle" aria-hidden="true">+</span>
                        </button>
                        <div id="faq-answer-${idx}" class="faq-answer" hidden>
                            <p>${a}</p>
                        </div>
                    </div>
                `;
            }).join('');
            faqDiv.innerHTML = `
                <div class="faq-heading">
                    <p class="faq-kicker">Need quick answers?</p>
                    <h3>Frequently Asked Questions</h3>
                </div>
                <div class="faq-list">${faqList}</div>
            `;
            article.appendChild(faqDiv);
            faqDiv.querySelectorAll('.faq-question').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const answerId = btn.getAttribute('aria-controls');
                    const answer = faqDiv.querySelector(`#${answerId}`);
                    const isOpen = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', String(!isOpen));
                    answer.hidden = isOpen;
                    btn.parentElement.classList.toggle('open', !isOpen);
                });
            });
        }
        
        // Replace container with article
        document.getElementById('blog-post-container').innerHTML = '';
        document.getElementById('blog-post-container').appendChild(article);
        
        // Sidebar will be updated automatically via sidebarComponentLoaded events
        
    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('blog-post-container').innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2 style="font-size: 32px; margin-bottom: 20px;">Error</h2>
                <p style="font-size: 18px; color: #666; margin-bottom: 30px;">An error occurred while loading the post.</p>
                <a href="/" style="display: inline-block; padding: 15px 30px; background-color: #2c2c2c; color: #fff; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Go to Homepage</a>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    const success = await fetchBlogData();
    
    const page = detectCurrentPage();
    
    if (page === 'home') {
        if (!success) {
            showLoadingError('home');
        } else {
            initializeSearch();
            loadHomepageWithFilter();
        }
    } else if (page === 'featured') {
        if (!success) {
            showLoadingError('featured');
        } else {
            loadFeaturedBlogsPage();
        }
    } else if (page === 'blog-post') {
        // Load individual blog post
        await loadBlogPost();
    }
});

// Show loading error with retry option
function showLoadingError(pageType) {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles) return;
    
    mainArticles.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 60px 20px;">
            <h2 style="color: #d32f2f; margin-bottom: 16px;">⚠️ Error Loading Blogs</h2>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">An error occurred while loading the blog data. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()" style="padding: 12px 24px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Refresh Page</button>
        </div>
    `;
}

// Initialize lazy loading with Intersection Observer
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        intersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy-image');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
    }
}

// Observe lazy images
function observeLazyImages() {
    if (!intersectionObserver) return;
    
    const lazyImages = document.querySelectorAll('img.lazy-image[data-src]');
    lazyImages.forEach(img => {
        intersectionObserver.observe(img);
    });
}

// Search and filter functionality
function initializeSearch() {
    const searchInput = document.getElementById('blog-search-input');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        // Real-time search with debounce
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearchTerm = e.target.value.trim();
                applyFilters();
            }, 300);
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentCategoryFilter = e.target.value;
            applyFilters();
        });
        
        // Populate category filter
        populateCategoryFilter();
    }
}

// Populate category filter dropdown
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    const categories = getCategoriesWithCounts();
    
    let html = '<option value="">All Categories</option>';
    categories.forEach(cat => {
        html += `<option value="${escapeHtml(cat.name)}">${escapeHtml(cat.name)} (${cat.count})</option>`;
    });
    
    categoryFilter.innerHTML = html;
}

// Apply search and filter
function applyFilters() {
    currentPage = 1;
    
    // Get all posts
    let posts = [...postsWithParsedDates];
    
    // Apply category filter
    if (currentCategoryFilter) {
        posts = posts.filter(post => 
            post.category && post.category.toLowerCase() === currentCategoryFilter.toLowerCase()
        );
    }
    
    // Apply search filter
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        posts = posts.filter(post => {
            return (
                (post.title && post.title.toLowerCase().includes(searchLower)) ||
                (post.content && post.content.toLowerCase().includes(searchLower)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
                (post.author && post.author.toLowerCase().includes(searchLower)) ||
                (post.category && post.category.toLowerCase().includes(searchLower))
            );
        });
    }
    
    filteredPosts = posts.sort((a, b) => b.parsedDate - a.parsedDate);
    
    // Update display
    displayFilteredResults();
}

// Display filtered results
function displayFilteredResults() {
    const mainArticles = document.querySelector('.main-articles');
    if (!mainArticles) return;
    
    let html = '';
    
    // Show filter status
    if (currentSearchTerm || currentCategoryFilter) {
        const filterDesc = [];
        if (currentSearchTerm) filterDesc.push(`Search: "${currentSearchTerm}"`);
        if (currentCategoryFilter) filterDesc.push(`Category: ${currentCategoryFilter}`);
        
        html += `
            <div class="filter-status">
                <span>${filterDesc.join(' | ')}</span>
                <button id="clear-filters" class="clear-filters-btn">Clear Filters ✕</button>
            </div>
        `;
    }
    
    if (filteredPosts.length === 0) {
        html += `
            <div class="no-results">
                <h3>No posts found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        mainArticles.innerHTML = html;
        hidePagination();
        return;
    }
    
    html += `<h2 class="section-title">📰 Results (${filteredPosts.length} posts)</h2>`;
    
    // Paginate results
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToDisplay = filteredPosts.slice(startIndex, endIndex);
    
    postsToDisplay.forEach((post, index) => {
        html += createArticleHTML(post, true);
        if (index < postsToDisplay.length - 1) html += '<div class="article-divider"></div>';
    });
    
    mainArticles.innerHTML = html;
    
    // Add event listener for clear button
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            currentSearchTerm = '';
            currentCategoryFilter = '';
            const searchInput = document.getElementById('blog-search-input');
            const categoryFilter = document.getElementById('category-filter');
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = '';
            loadHomepageWithFilter();
        });
    }
    
    // Update pagination for filtered results
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    updatePaginationControlsFiltered(currentPage, totalPages);
    
    // Apply lazy loading
    observeLazyImages();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update pagination for filtered results
function updatePaginationControlsFiltered(page, totalPages) {
    const paginationControls = document.getElementById('pagination-controls');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    if (!paginationControls || totalPages <= 1) {
        hidePagination();
        return;
    }
    
    paginationControls.style.display = 'flex';
    pageInfo.textContent = `Page ${page} of ${totalPages}`;
    
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;
    
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    newPrevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayFilteredResults();
        }
    });
    
    newNextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayFilteredResults();
        }
    });
}

// Listen for sidebar component loaded events to populate them
document.addEventListener('sidebarComponentLoaded', function(e) {
    if (!dataLoaded) return;
    
    const filePath = e.detail.filePath;
    
    // Use requestAnimationFrame to ensure DOM is fully updated
    requestAnimationFrame(function() {
        // Populate featured sidebar when it loads
        if (filePath.includes('sidebar-featured.html')) {
            updateFeaturedSidebar();
        }
        
        // Populate popular categories when it loads
        if (filePath.includes('sidebar-popular-categories.html')) {
            updatePopularCategories();
        }
        
        // Populate categories sidebar when it loads
        if (filePath.includes('sidebar-categories.html')) {
            updateCategoriesSidebar();
        }
    });
});