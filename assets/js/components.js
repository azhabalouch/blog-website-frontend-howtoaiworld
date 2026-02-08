// Load dynamic components (nav and footer) from separate files
function loadComponents() {
    // Load navigation
    loadComponent('/components/nav.html', 'header', true);
    // Load footer  
    loadComponent('/components/footer.html', 'footer', false);

    // Load sidebar components if sidebar-components div exists
    if (document.getElementById('sidebar-components')) {
        // Normalize pathname: remove trailing slashes and index.html, then get the last segment
        let pathname = normalizePathname(window.location.pathname);
        const currentPage = pathname.replace(/^\/(pages|legal)\//, '').split('/').pop() || 'index';
        
        // Load specific components based on page - SEQUENTIALLY
        if (currentPage === 'index' || currentPage === '' || currentPage === '/') {
            // Load in order: Featured → Popular Categories → Categories → Newsletter
            loadSidebarComponentsSequentially([
                '/components/sidebar-featured.html',
                '/components/sidebar-popular-categories.html',
                '/components/sidebar-categories.html',
                '/components/sidebar-newsletter.html'
            ]);
        } else if (currentPage === 'contact') {
            loadSidebarComponentsSequentially([
                '/components/sidebar-inquiry-message.html',
                '/components/sidebar-social.html'
            ]);
        } else if (currentPage === 'featured') {
            // Load in order: Popular Categories → Categories → Newsletter
            loadSidebarComponentsSequentially([
                '/components/sidebar-popular-categories.html',
                '/components/sidebar-categories.html',
                '/components/sidebar-newsletter.html'
            ]);
        } else if (currentPage === 'about') {
            loadSidebarComponent('/components/sidebar-contact.html');
        } else if (currentPage === 'blog-post') {
            loadSidebarComponentsSequentially([
                '/components/sidebar-categories.html',
                '/components/sidebar-newsletter.html'
            ]);
        } else if (currentPage === 'thanks') {
            loadSidebarComponentsSequentially([
                '/components/sidebar-contact.html',
                '/components/sidebar-social.html'
            ]);
        } else if (currentPage === 'privacy' || currentPage === 'terms' || currentPage === 'disclaimer') {
            loadSidebarComponent('/components/sidebar-legal.html');
        }
        // Add more conditions for other pages as needed
    }
}

// Helper to load sidebar components sequentially
function loadSidebarComponentsSequentially(filePaths) {
    if (!filePaths || filePaths.length === 0) return Promise.resolve();
    
    // Load components one by one in sequence
    return filePaths.reduce(function(promise, filePath) {
        return promise.then(function() {
            return loadSidebarComponent(filePath);
        });
    }, Promise.resolve());
}

// Helper to load sidebar components - returns a promise
function loadSidebarComponent(filePath) {
    return fetch(filePath)
        .then(function(response) {
            if (response.ok) return response.text();
            return '';
        })
        .then(function(html) {
            if (html) {
                var sidebarDiv = document.getElementById('sidebar-components');
                if (sidebarDiv) {
                    sidebarDiv.insertAdjacentHTML('beforeend', html);
                    // Dispatch event after sidebar component is loaded
                    document.dispatchEvent(new CustomEvent('sidebarComponentLoaded', {
                        detail: { filePath: filePath }
                    }));
                }
            }
        })
        .catch(function() {});
}

// Helper function to load individual components
function loadComponent(filePath, tagName, isHeader) {
    const xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
        if (xhr.status === 0 || xhr.status === 200) {
            insertComponent(xhr.responseText, tagName, isHeader);
        }
    };
    
    xhr.onerror = function() {};
    
    try {
        xhr.open('GET', filePath, true);
        xhr.send();
    } catch (e) {}
}

// Insert component into page
function insertComponent(content, tagName, isHeader) {
    if (!content || content.trim() === '') return;
    
    const element = createElementFromHTML(content);
    if (!element) return;
    
    // Find and replace comment placeholder
    let inserted = false;
    const nodeList = Array.from(document.body.childNodes);
    
    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        if (node.nodeType === Node.COMMENT_NODE) {
            const commentText = node.textContent.toLowerCase();
            if (isHeader && commentText.includes('header') && commentText.includes('loaded')) {
                node.parentNode.replaceChild(element, node);
                inserted = true;
                break;
            } else if (!isHeader && commentText.includes('footer') && commentText.includes('loaded')) {
                node.parentNode.replaceChild(element, node);
                inserted = true;
                break;
            }
        }
    }
    
    if (!inserted) {
        // Fallback: add to body if comment not found
        if (isHeader) {
            document.body.insertBefore(element, document.body.firstChild);
        } else {
            document.body.appendChild(element);
        }
    }
    
    // After insertion, update nav and date if this was the header
    if (isHeader) {
        setTimeout(() => {
            setActiveNavLink();
            updateCurrentDate();
            // Initialize search after nav is loaded
            initializeNavSearch();
        }, 50);
    } else {
        setTimeout(() => {
            updateFooterYear();
            // Initialize contact modal after footer is loaded
            if (typeof initContactModal === 'function') {
                initContactModal();
            }
        }, 50);
    }
}

// Helper function to create element from HTML string
function createElementFromHTML(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    const fragment = document.createDocumentFragment();
    fragment.append(...template.content.childNodes);
    return fragment;
}

/**
 * Normalize a pathname for consistent comparison by removing trailing slashes and index.html
 * @param {string} pathname - The pathname to normalize
 * @returns {string} The normalized pathname, or '/' for the root path
 */
function normalizePathname(pathname) {
    return pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
}

// Set active navigation link based on current page
function setActiveNavLink() {
    // Normalize pathname: remove trailing slashes and index.html
    let pathname = normalizePathname(window.location.pathname);
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (navLinks.length === 0) return;
    
    navLinks.forEach(link => {
        // Normalize the link's pathname as well
        let linkPathname = normalizePathname(link.pathname);
        
        // Check if the normalized pathnames match
        if (linkPathname === pathname) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Update current date
function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

// Update footer year for copyright
function updateFooterYear() {
    const yearElement = document.getElementById('footer-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    // DOM is already loaded
    loadComponents();
}

// Initialize navigation search panel (moved from blog-loader.js)
function initializeNavSearch() {
    const searchPanel = document.getElementById('nav-search-panel');
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchCloseBtn = document.getElementById('nav-search-close');
    
    if (!searchToggleBtn || !searchPanel) return;
    
    searchToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = searchPanel.style.display === 'block';
        searchPanel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            setTimeout(() => {
                const searchInput = document.getElementById('blog-search-input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    });
    
    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchPanel.style.display = 'none';
        });
    }
    
    // Close on click outside
    document.addEventListener('click', (e) => {
        if (searchPanel.style.display === 'block') {
            if (!searchPanel.contains(e.target) && e.target !== searchToggleBtn && !searchToggleBtn.contains(e.target)) {
                searchPanel.style.display = 'none';
            }
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchPanel.style.display === 'block') {
            searchPanel.style.display = 'none';
        }
    });
}
