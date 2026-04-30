import os
import json
import re
import urllib.parse
from functools import cmp_to_key
from build_blogs import fetch_blogs, slugify_title, parse_date, escape_html, strip_html_tags, SITE_ORIGIN


def calculate_reading_time(content):
    if not content:
        return '1 min read'
    text = strip_html_tags(content)
    word_count = len(text.split())
    minutes = max(1, round(word_count / 200))
    return f"{minutes} min read"


def generate_article_html(post, is_excerpt=True, path_prefix=''):
    title = post.get('title', '')
    author = post.get('author', '')
    category = post.get('category', '')
    date_str = post.get('date', '')
    content_key = 'excerpt' if is_excerpt else 'content'
    content = post.get(content_key, post.get('content', ''))

    slug = slugify_title(
        post.get('slug') or post.get('title') or str(post.get('id', '')))
    _, fmt_date = parse_date(date_str)

    reading_time = calculate_reading_time(
        post.get('content', post.get('excerpt', '')))

    featured_image = post.get('featured_image', '')
    featured_image_html = ''
    if is_excerpt and featured_image:
        featured_image_html = f'''<div class="article-featured-image">
            <img data-src="{escape_html(featured_image)}" alt="{escape_html(title)}" class="lazy-image" loading="lazy" />
        </div>'''

    read_more_link = '<span class="read-more">Continue Reading &rarr;</span>' if is_excerpt else ''

    return f'''
        <article class="blog-article" data-post-id="{post.get('id', '')}">
            <a href="{path_prefix}blogs/{slug}/index.html" class="article-card-link">
                <h3 class="article-title">{escape_html(title)}</h3>
                <div class="article-meta">
                    <span class="author">By {escape_html(author)}</span>
                    <span class="separator">•</span>
                    <time datetime="{parse_date(date_str)[0]}">{fmt_date}</time>
                    <span class="separator">•</span>
                    <span class="reading-time">{reading_time}</span>
                    <span class="separator">•</span>
                    <span class="category-tag">{escape_html(category)}</span>
                </div>
                {featured_image_html}
                <div class="article-content">
                    {content}
                </div>
                {read_more_link}
            </a>
        </article>
    '''


def inject_main_articles(file_path, html_chunk, path_prefix=''):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # We replace everything inside <section class="main-articles"...> ... </section>
    pattern = r'(<section[^>]*class="[^"]*main-articles[^"]*"[^>]*>).*?(</section>)'
    replacement = r'\g<1>\n' + html_chunk.replace('\\', '\\\\') + r'\n\g<2>'

    new_html = re.sub(pattern, replacement, html, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_html)


def generate_sidebars_and_home():
    blogs = fetch_blogs()
    if not blogs:
        return

    def get_parsed_date(post):
        date_str = post.get('date', '')
        iso, _ = parse_date(date_str)
        return iso

    sorted_blogs = sorted(blogs, key=get_parsed_date, reverse=True)

    # 1. sidebar-featured.html
    featured = sorted_blogs[:3]
    featured_html = '<div class="sidebar-section" id="sidebar-inquiry-message">\n    <h3 class="sidebar-title">Featured Posts</h3>\n    <ul id="featured-blogs-list" class="featured-list">\n'
    for i, post in enumerate(featured):
        slug = slugify_title(
            post.get('slug') or post.get('title') or str(post.get('id', '')))
        _, fmt_date = parse_date(post.get('date'))
        featured_html += f'''        <li class="featured-item">
            <a href="blogs/{slug}/index.html" class="featured-link">
                <span class="featured-number">{i + 1}</span>
                <div class="featured-content">
                    <h4 class="featured-title">{escape_html(post.get('title'))}</h4>
                    <div class="featured-meta">
                        <span class="featured-category">{escape_html(post.get('category', 'Uncategorized'))}</span>
                        <span class="featured-date">{fmt_date}</span>
                    </div>
                </div>
            </a>
        </li>\n'''
    featured_html += '    </ul>\n</div>'
    with open('components/sidebar-featured.html', 'w', encoding='utf-8') as f:
        f.write(featured_html)

    # 2. sidebar-categories.html
    cat_counts = {}
    for post in blogs:
        cat = post.get('category', 'Uncategorized')
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
    sorted_cats = sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)
    popular = [c for c in sorted_cats if c[1] >= 5][:4]
    pop_html = '<div class="sidebar-section">\n    <h3 class="sidebar-title">Popular Categories</h3>\n    <ul class="popular-categories" id="popular-categories">\n'
    if not popular:
        pop_html += '        <li class="empty-state">No popular categories yet</li>\n'
    else:
        for cat, count in popular:
            pop_html += f'        <li class="category-item"><a href="index.html?category={urllib.parse.quote(cat)}" class="category-link"><span>{escape_html(cat)}</span><span class="count">{count}</span></a></li>\n'
    pop_html += '    </ul>\n</div>'
    with open('components/sidebar-popular-categories.html',
              'w',
              encoding='utf-8') as f:
        f.write(pop_html)

    cat_html = '<div class="sidebar-section">\n    <h3 class="sidebar-title">Categories</h3>\n    <ul class="categories-list" id="categories-list">\n'
    cat_html += '        <li><a href="index.html">All Posts</a></li>\n'
    for cat, count in sorted_cats:
        cat_html += f'        <li><a href="index.html?category={urllib.parse.quote(cat)}">{escape_html(cat)} ({count})</a></li>\n'
    cat_html += '    </ul>\n</div>'
    with open('components/sidebar-categories.html', 'w',
              encoding='utf-8') as f:
        f.write(cat_html)

    # Dump blogs to local JSON
    os.makedirs('assets/data', exist_ok=True)
    with open('assets/data/blogs.json', 'w', encoding='utf-8') as f:
        json.dump(blogs, f)

    # 3. Inject first 7 articles into index.html
    home_posts = sorted_blogs[:7]
    home_html = '<h2 class="section-title">Latest Articles</h2>\n'
    for i, post in enumerate(home_posts):
        home_html += generate_article_html(post)
        if i < len(home_posts) - 1:
            home_html += '<div class="article-divider"></div>\n'
    inject_main_articles('index.html', home_html)

    # 4. Inject 3 articles into featured.html
    featured_page_html = '<h2 class="section-title">Featured Articles</h2>\n'
    for i, post in enumerate(featured):
        featured_page_html += generate_article_html(post)
        if i < len(featured) - 1:
            featured_page_html += '<div class="article-divider"></div>\n'
    inject_main_articles('featured.html', featured_page_html)


if __name__ == '__main__':
    generate_sidebars_and_home()
