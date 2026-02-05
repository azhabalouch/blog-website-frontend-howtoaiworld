// Load dynamic components (nav and footer) from separate files
function loadComponents() {
    // Load navigation
    loadComponent('/components/nav.html', 'header', true);
    // Load footer  
    loadComponent('/components/footer.html', 'footer', false);

    // Load sidebar components if sidebar-components div exists
    if (document.getElementById('sidebar-components')) {
        const currentPage = window.location.pathname.replace(/^\/(pages|legal)\//, '').replace(/\.html$/, '').split('/').pop() || 'index';
        
        // Load specific components based on page
        if (currentPage === 'index' || currentPage === '' || currentPage === '/') {
            loadSidebarComponent('/components/sidebar-featured.html');
            loadSidebarComponent('/components/sidebar-ad.html');
            loadSidebarComponent('/components/sidebar-categories.html');
            loadSidebarComponent('/components/sidebar-popular-categories.html');
            loadSidebarComponent('/components/sidebar-newsletter.html');
        } else if (currentPage === 'contact') {
            loadSidebarComponent('/components/sidebar-inquiry-message.html');
            loadSidebarComponent('/components/sidebar-social.html');
            loadSidebarComponent('/components/sidebar-ad.html');
        } else if (currentPage === 'featured') {
            loadSidebarComponent('/components/sidebar-ad.html');
            loadSidebarComponent('/components/sidebar-categories.html');
            loadSidebarComponent('/components/sidebar-popular-categories.html');
            loadSidebarComponent('/components/sidebar-newsletter.html');
        } else if (currentPage === 'about') {
            loadSidebarComponent('/components/sidebar-ad.html');
            loadSidebarComponent('/components/sidebar-contact.html');
        } else if (currentPage === 'recent-blogs') {
            loadSidebarComponent('/components/sidebar-categories.html');
            loadSidebarComponent('/components/sidebar-ad.html');
            loadSidebarComponent('/components/sidebar-newsletter.html');
        } else if (currentPage === 'blog-post') {
            loadSidebarComponent('/components/sidebar-ad.html');
            loadSidebarComponent('/components/sidebar-categories.html');
            loadSidebarComponent('/components/sidebar-newsletter.html');
        } else if (currentPage === 'trending') {
            loadSidebarComponent('/components/sidebar-ad.html');
            loadSidebarComponent('/components/sidebar-popular-categories.html');
        } else if (currentPage === 'thanks') {
            loadSidebarComponent('/components/sidebar-contact.html');
            loadSidebarComponent('/components/sidebar-social.html');
            loadSidebarComponent('/components/sidebar-ad.html');
        } else if (currentPage === 'privacy' || currentPage === 'terms' || currentPage === 'disclaimer') {
            loadSidebarComponent('/components/sidebar-legal.html');
        }
        // Add more conditions for other pages as needed
    }
}

// Helper to load sidebar components
function loadSidebarComponent(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 0 || xhr.status === 200) {
            const sidebarDiv = document.getElementById('sidebar-components');
            if (sidebarDiv) {
                sidebarDiv.insertAdjacentHTML('beforeend', xhr.responseText);
            }
        }
    };
    xhr.onerror = function() {};
    try {
        xhr.open('GET', filePath, true);
        xhr.send();
    } catch (e) {}
}

// Helper function to load individual components
function loadComponent(filePath, tagName, isHeader) {
    const xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
        if (xhr.status === 0 || xhr.status === 200) {
            insertComponent(xhr.responseText, tagName, isHeader);
        } else {
            console.warn('Could not load ' + filePath + ' (status: ' + xhr.status + ')');
        }
    };
    
    xhr.onerror = function() {
        console.warn('Error loading ' + filePath);
    };
    
    try {
        xhr.open('GET', filePath, true);
        xhr.send();
    } catch (e) {
        console.warn('Error loading ' + filePath + ':', e.message);
    }
}

// Insert component into page
function insertComponent(content, tagName, isHeader) {
    if (!content || content.trim() === '') {
        console.warn('Empty content for ' + tagName);
        return;
    }
    
    const element = createElementFromHTML(content);
    
    if (!element) {
        console.warn('Could not parse ' + tagName + ' content');
        return;
    }
    
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
        }, 50);
    } else {
        setTimeout(() => {
            updateFooterYear();
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

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (navLinks.length === 0) {
        console.warn('No nav links found');
        return;
    }
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Check if the link matches the current page
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
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
