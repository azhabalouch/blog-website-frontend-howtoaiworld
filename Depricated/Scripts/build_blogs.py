#!/usr/bin/env python3
import os
import json
import re
import unicodedata
import urllib.request
from datetime import datetime

BLOG_DATA_URL = 'https://azhabalouch.github.io/blogs-data-api/api.json'
SITE_ORIGIN = 'https://howtoaiworld.com'


def slugify_title(title):
    normalized = unicodedata.normalize('NFKD', str(title or ''))
    ascii_text = normalized.encode('ascii', 'ignore').decode('ascii').lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', ascii_text).strip()
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug


def parse_date(date_text):
    today = datetime.now().strftime('%Y-%m-%d')
    if not date_text:
        return today

    date_value = str(date_text).strip()
    if '//' in date_value:
        parts = date_value.split('//')
        if len(parts) == 3:
            try:
                month = int(parts[0])
                day = int(parts[1])
                year = int(parts[2])
                dt = datetime(year, month, day)
                return dt.isoformat() + 'T00:00:00Z', dt.strftime('%B %d, %Y')
            except ValueError:
                pass

    for fmt in ('%Y-%m-%d', '%Y/%m/%d', '%m/%d/%Y', '%m-%d-%Y', '%B %d, %Y',
                '%b %d, %Y'):
        try:
            dt = datetime.strptime(date_value, fmt)
            return dt.isoformat() + 'T00:00:00Z', dt.strftime('%B %d, %Y')
        except ValueError:
            continue

    return today, today


def escape_html(text):
    """Simple HTML escaping."""
    if not text:
        return ""
    text = str(text)
    return text.replace('&', '&amp;').replace('<', '&lt;').replace(
        '>', '&gt;').replace('"', '&quot;').replace("'", '&#039;')


def strip_html_tags(text):
    if not text:
        return ''
    return re.sub(r'<[^>]+>', '', text).strip()


def get_seo_description(post, max_length=155):
    source_text = strip_html_tags(
        post.get('excerpt',
                 post.get('content', 'Read this article on Howtoaiworld.')))
    if len(source_text) <= max_length:
        return source_text
    return f"{source_text[:max_length - 1].strip()}..."


def fetch_blogs():
    try:
        with urllib.request.urlopen(BLOG_DATA_URL, timeout=20) as response:
            payload = json.loads(response.read().decode('utf-8'))
            if isinstance(payload, dict) and isinstance(
                    payload.get('blogs'), list):
                return payload['blogs']
            if isinstance(payload, list):
                return payload
    except Exception as e:
        print(f"Error fetching blogs: {e}")
    return []


# We'll need a template for the HTML.
TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google Consent Mode to manage user consent for analytics and ads -->
    <script data-cookieconsent="ignore">    window.dataLayer = window.dataLayer || [];    function gtag() {        dataLayer.push(arguments);    }    gtag("consent", "default", {        ad_personalization: "denied",        ad_storage: "denied",        ad_user_data: "denied",        analytics_storage: "denied",        functionality_storage: "denied",        personalization_storage: "denied",        security_storage: "granted",        wait_for_update: 500,    });    gtag("set", "ads_data_redaction", true);    gtag("set", "url_passthrough", false);</script>

    <!-- Cookiebot for Cookie Consent -->
    <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="402f2129-fdd2-44e0-b450-f6d922daebf4" data-blockingmode="auto" type="text/javascript"></script>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HWT034PQT2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-HWT034PQT2');
    </script>

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MPVWNXWV');</script>
    <!-- End Google Tag Manager -->

    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8450943980358095"
     crossorigin="anonymous"></script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="64x64" href="../../assets/images/icons8-favicon-64.png">
    <link rel="icon" type="image/png" sizes="96x96" href="../../assets/images/icons8-favicon-96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../../assets/images/icons8-favicon-64.png">
    <link rel="shortcut icon" href="../../assets/images/icons8-favicon-64.png">
    <meta name="description" content="{seo_description}">
    
    {keywords_meta}
    
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta name="author" content="{author}">
    <meta property="og:site_name" content="Howtoaiworld">
    <meta property="og:type" content="article">
    <meta property="og:title" content="{title} | Howtoaiworld">
    <meta property="og:description" content="{seo_description}">
    <meta property="og:url" content="{post_url}">
    <meta property="og:image" content="{image_url}">
    <meta property="article:published_time" content="{published_date_iso}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@howtoaiworld">
    <meta name="twitter:title" content="{title} | Howtoaiworld">
    <meta name="twitter:description" content="{seo_description}">
    <meta name="twitter:image" content="{image_url}">
    <title id="page-title">{title} | Howtoaiworld</title>
    <link rel="stylesheet" href="../../assets/css/styles.css">
    <link rel="canonical" href="{post_url}">
    <link rel="preconnect" href="https://azhabalouch.github.io">
    <link rel="dns-prefetch" href="https://azhabalouch.github.io">
    <script type="application/ld+json" id="post-structured-data">
        {schema_json}
    </script>
    {faq_schema_script}
    <meta name="google-adsense-account" content="ca-pub-8450943980358095">
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPVWNXWV"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
     
    <!-- Header will be loaded dynamically -->

    <main class="main-content" id="main-content" role="main" aria-label="Main content">
        <div class="container">
            <div class="content-grid">
                <section class="main-articles" id="blog-post-container">
                    <article class="featured-article">
                        <h1 class="article-title">{title_escaped}</h1>
                        <div class="article-meta">
                            <span class="author">By {author_escaped}</span>
                            <span class="separator">|</span>
                            <time datetime="{published_date_iso}">{published_date_formatted}</time>
                            <span class="separator">|</span>
                            <a href="../../index.html?category={category_url}" style="color: #c41e3a; text-decoration: none; font-weight: bold;">{category_escaped}</a>
                        </div>
                        
                        {keywords_html}
                        
                        {featured_image_html}
                        
                        <div class="article-content">
                            {content}
                        </div>
                        
                        {faq_html}
                        
                        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #ddd;">
                            <a href="../../index.html" class="back-to-posts-link">← Back to All Posts</a>
                        </div>
                    </article>
                </section>

                <aside class="sidebar">
                    <div id="sidebar-components"></div>
                </aside>
            </div>
        </div>
    </main>

    <!-- Footer will be loaded dynamically -->

    <script>
        // Set base path for components dynamically fetching assets
        window.BLOG_SITE_BASE_PATH = '../../';
    </script>

    <script src="../../assets/js/contact-modal.js" defer></script>
    <script src="../../assets/js/components.js" defer></script>
    <script src="../../assets/js/blog-loader.js" defer></script>
    <!-- Sender.net Email Marketing (deferred) -->
    <script>
        window.addEventListener('load', function() {
            (function (s, e, n, d, er) {
                s['Sender'] = er;
                s[er] = s[er] || function () {
                (s[er].q = s[er].q || []).push(arguments)
                }, s[er].l = 1 * new Date();
                var a = e.createElement(n),
                    m = e.getElementsByTagName(n)[0];
                a.async = 1;
                a.src = d;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://cdn.sender.net/accounts_resources/universal.js', 'sender');
            sender('6ec66dfe790619');
        });
    </script>
</body>
</html>
"""


def generate_static_pages():
    blogs = fetch_blogs()
    if not blogs:
        print("No blogs found.")
        return

    base_dir = os.path.join(os.path.dirname(__file__), 'blogs')
    os.makedirs(base_dir, exist_ok=True)

    for post in blogs:
        title = post.get('title', '')
        # Handle both slug and slug-id conceptually: getPostSlug maps to slugifyTitle of slug/title/id
        # Let's match JS exactly what JS did:
        # postSlug = slugifyTitle(post.slug || post.title || String(post.id || ''))
        raw_slug = post.get('slug') or post.get('title') or str(
            post.get('id', ''))
        slug = slugify_title(raw_slug)
        if not slug:
            continue

        post_dir = os.path.join(base_dir, slug)
        os.makedirs(post_dir, exist_ok=True)

        post_url = f"{SITE_ORIGIN}/blogs/{slug}/"
        image_url = post.get('featured_image', f"{SITE_ORIGIN}/og-image.jpg")
        seo_description = escape_html(get_seo_description(post))
        published_date_iso, published_date_formatted = parse_date(
            post.get('date'))

        author = post.get('author', 'Howtoaiworld Editorial Team')
        category = post.get('category', 'Uncategorized')

        keywords = post.get('keywords', [])
        keywords_meta = f'<meta name="keywords" content="{", ".join(escape_html(k) for k in keywords)}">' if keywords else ''

        keywords_html = ''
        if keywords:
            kw_list = "".join(
                f'<span style="display: inline-block; background-color: #f0f0f0; color: #333; padding: 4px 12px; margin-right: 8px; margin-top: 10px; border-radius: 16px; font-size: 13px; font-weight: 500;">{escape_html(k)}</span>'
                for k in keywords)
            keywords_html = f'<div class="article-keywords" style="margin-bottom: 20px;">{kw_list}</div>'

        featured_image_html = ''
        if post.get('featured_image'):
            captions = []
            if 'captions' in post:
                if isinstance(post['captions'], list):
                    captions = [
                        strip_html_tags(c).strip() for c in post['captions']
                        if c
                    ]
                elif isinstance(post['captions'], str):
                    captions = [
                        strip_html_tags(c).strip()
                        for c in post['captions'].splitlines() if c
                    ]

            caption = captions[0] if captions else ''
            alt_text = caption or strip_html_tags(title)
            figcaption = f'<figcaption class="image-caption">{escape_html(caption)}</figcaption>' if caption else ''

            featured_image_html = f'''<figure class="article-featured-media">
                <div class="article-featured-image">
                    <img src="{escape_html(post['featured_image'])}" alt="{escape_html(alt_text)}" />
                </div>
                {figcaption}
            </figure>'''

        # Minimal extraction of HTML content, similar to JS
        content = post.get('content', '')
        content = re.sub(r'<h1[^>]*>.*?</h1>', '', content)

        # Schema
        schema = post.get('seo_schema', {}).get(
            'article', {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                'headline': title,
                'description': seo_description,
                'image': [image_url],
                'datePublished': published_date_iso,
                'dateModified': published_date_iso,
                'author': {
                    '@type': 'Person',
                    'name': author
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': 'Howtoaiworld',
                    'logo': {
                        '@type': 'ImageObject',
                        'url':
                        f"{SITE_ORIGIN}/assets/images/icons8-favicon-96.png"
                    }
                },
                'mainEntityOfPage': {
                    '@type': 'WebPage',
                    '@id': post_url
                }
            })
        schema_json = json.dumps(schema, indent=4)

        faq_schema_script = ''
        faq_html = ''
        faq_items = post.get('faq') or post.get('FAQ')
        if post.get('seo_schema', {}).get('faq'):
            faq_schema = post['seo_schema']['faq']
            faq_schema_script = f'<script type="application/ld+json" id="post-faq-structured-data">\n{json.dumps(faq_schema, indent=4)}\n</script>'
        elif faq_items and isinstance(faq_items, list):
            valid_faqs = [
                item for item in faq_items
                if item.get('question') and item.get('answer')
            ]
            if valid_faqs:
                faq_schema = {
                    '@context':
                    'https://schema.org',
                    '@type':
                    'FAQPage',
                    'mainEntity': [{
                        '@type': 'Question',
                        'name': strip_html_tags(item['question']),
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': strip_html_tags(item['answer'])
                        }
                    } for item in valid_faqs]
                }
                faq_schema_script = f'<script type="application/ld+json" id="post-faq-structured-data">\n{json.dumps(faq_schema, indent=4)}\n</script>'

                faq_list_html = ""
                for idx, item in enumerate(valid_faqs):
                    q = escape_html(item.get('question'))
                    a = escape_html(item.get('answer'))
                    faq_list_html += f'''
                    <div class="faq-item" data-index="{idx}">
                        <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-{idx}">
                            <span class="faq-question-text">{q}</span>
                            <span class="faq-toggle" aria-hidden="true">+</span>
                        </button>
                        <div id="faq-answer-{idx}" class="faq-answer" hidden>
                            <p>{a}</p>
                        </div>
                    </div>
                    '''

                faq_html = f'''
                <div class="article-faq">
                    <div class="faq-heading">
                        <p class="faq-kicker">Need quick answers?</p>
                        <h3>Frequently Asked Questions</h3>
                    </div>
                    <div class="faq-list">{faq_list_html}</div>
                </div>
                '''

        html_output = TEMPLATE \
            .replace('{title}', escape_html(title)) \
            .replace('{title_escaped}', escape_html(title)) \
            .replace('{seo_description}', seo_description) \
            .replace('{author}', escape_html(author)) \
            .replace('{author_escaped}', escape_html(author)) \
            .replace('{post_url}', escape_html(post_url)) \
            .replace('{image_url}', escape_html(image_url)) \
            .replace('{published_date_iso}', escape_html(published_date_iso)) \
            .replace('{published_date_formatted}', escape_html(published_date_formatted)) \
            .replace('{category_url}', urllib.parse.quote(category)) \
            .replace('{category_escaped}', escape_html(category)) \
            .replace('{keywords_meta}', keywords_meta) \
            .replace('{keywords_html}', keywords_html) \
            .replace('{featured_image_html}', featured_image_html) \
            .replace('{content}', content) \
            .replace('{schema_json}', schema_json) \
            .replace('{faq_schema_script}', faq_schema_script) \
            .replace('{faq_html}', faq_html)

        with open(os.path.join(post_dir, 'index.html'), 'w',
                  encoding='utf-8') as f:
            f.write(html_output)

    print("Static blog generation completed.")


if __name__ == '__main__':
    generate_static_pages()
