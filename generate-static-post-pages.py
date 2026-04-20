#!/usr/bin/env python3
"""
Generate static HTML pages for blog posts at /posts/<slug>.html.
This improves crawlability and indexing by exposing each article at a static URL.
"""

from __future__ import annotations

import html
import json
import re
import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen

BLOG_DATA_URL = "https://azhabalouch.github.io/blogs-data-api/api.json"
SITE_URL = "https://howtoaiworld.com"
OUTPUT_DIR = Path("posts")


def slugify_title(title: str) -> str:
    normalized = unicodedata.normalize("NFKD", str(title or ""))
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii").lower()
    slug = re.sub(r"[^a-z0-9\s-]", "", ascii_text).strip()
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug


def parse_post_date(date_text: str) -> str:
    today = datetime.now().strftime("%Y-%m-%d")
    if not date_text:
        return today

    value = str(date_text).strip()
    if "//" in value:
        parts = value.split("//")
        if len(parts) == 3:
            try:
                month = int(parts[0])
                day = int(parts[1])
                year = int(parts[2])
                return datetime(year, month, day).strftime("%Y-%m-%d")
            except ValueError:
                return today

    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%m/%d/%Y", "%m-%d-%Y", "%B %d, %Y",
                "%b %d, %Y"):
        try:
            return datetime.strptime(value, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue

    return today


def fetch_posts() -> list[dict]:
    with urlopen(BLOG_DATA_URL, timeout=20) as response:
        payload = json.loads(response.read().decode("utf-8"))

    if isinstance(payload, dict) and isinstance(payload.get("blogs"), list):
        return payload["blogs"]
    if isinstance(payload, list):
        return payload
    return []


def strip_first_h1(content: str) -> str:
    return re.sub(r"<h1[^>]*>.*?</h1>",
                  "",
                  content or "",
                  count=1,
                  flags=re.IGNORECASE | re.DOTALL)


def escape_attr(text: str) -> str:
    return html.escape(str(text or ""), quote=True)


def seo_description(post: dict) -> str:
    raw = post.get("excerpt") or post.get(
        "content") or "Read this article on Howtoaiworld."
    plain = re.sub(r"<[^>]+>", "", raw)
    plain = re.sub(r"\s+", " ", plain).strip()
    if len(plain) > 155:
        plain = plain[:154].rstrip() + "..."
    return plain or "Read this article on Howtoaiworld."


def render_faq(post: dict) -> str:
    faq_items = post.get("faq") or post.get("FAQ")
    if not isinstance(faq_items, list) or not faq_items:
        return ""

    chunks = []
    for item in faq_items:
        if not isinstance(item, dict):
            continue
        question = escape_attr(item.get("question") or "Question")
        answer = escape_attr(item.get("answer") or "")
        chunks.append(f"""
            <div class=\"faq-item\">
                <h3 class=\"faq-question\">{question}</h3>
                <p>{answer}</p>
            </div>
            """.strip())

    if not chunks:
        return ""

    return (
        "<section class=\"article-faq\">"
        "<div class=\"faq-heading\"><p class=\"faq-kicker\">Need quick answers?</p><h2>Frequently Asked Questions</h2></div>"
        f"<div class=\"faq-list\">{''.join(chunks)}</div>"
        "</section>")


def render_page(post: dict) -> str:
    title = str(post.get("title") or "Untitled Article")
    slug = slugify_title(post.get("slug") or title)
    if not slug:
        return ""

    canonical_url = f"{SITE_URL}/posts/{slug}.html"
    image_url = post.get("featured_image") or f"{SITE_URL}/og-image.jpg"
    author = str(post.get("author") or "Howtoaiworld Editorial Team")
    category = str(post.get("category") or "Uncategorized")
    category_query = quote(category)
    iso_date = parse_post_date(post.get("date"))
    date_for_display = html.escape(str(post.get("date") or iso_date))
    description = escape_attr(seo_description(post))

    body_content = strip_first_h1(
        str(post.get("content") or post.get("excerpt") or ""))
    faq_html = render_faq(post)

    featured_image_html = ""
    if post.get("featured_image"):
        featured_image_html = (
            "<div class=\"article-featured-image\" style=\"margin-bottom:30px;text-align:center;\">"
            f"<img src=\"{escape_attr(post['featured_image'])}\" alt=\"{escape_attr(title)}\" style=\"max-width:100%;height:auto;border-radius:8px;\" />"
            "</div>")

    json_ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": seo_description(post),
        "image": [image_url],
        "datePublished": iso_date,
        "dateModified": iso_date,
        "author": {
            "@type": "Person",
            "name": author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Howtoaiworld",
            "logo": {
                "@type": "ImageObject",
                "url": f"{SITE_URL}/assets/images/icons8-favicon-96.png",
            },
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical_url
        },
    }

    return f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>{escape_attr(title)} | Howtoaiworld</title>
    <meta name=\"description\" content=\"{description}\">
    <meta name=\"robots\" content=\"index, follow, max-snippet:-1, max-image-preview:large\">
    <meta name=\"author\" content=\"Howtoaiworld\">

    <meta property=\"og:site_name\" content=\"Howtoaiworld\">
    <meta property=\"og:type\" content=\"article\">
    <meta property=\"og:title\" content=\"{escape_attr(title)} | Howtoaiworld\">
    <meta property=\"og:description\" content=\"{description}\">
    <meta property=\"og:url\" content=\"{canonical_url}\">
    <meta property=\"og:image\" content=\"{escape_attr(image_url)}\">
    <meta property=\"article:published_time\" content=\"{iso_date}\">

    <meta name=\"twitter:card\" content=\"summary_large_image\">
    <meta name=\"twitter:site\" content=\"@howtoaiworld\">
    <meta name=\"twitter:title\" content=\"{escape_attr(title)} | Howtoaiworld\">
    <meta name=\"twitter:description\" content=\"{description}\">
    <meta name=\"twitter:image\" content=\"{escape_attr(image_url)}\">

    <link rel=\"canonical\" href=\"{canonical_url}\">
    <link rel=\"stylesheet\" href=\"../assets/css/styles.css\">

    <script type=\"application/ld+json\">{json.dumps(json_ld, ensure_ascii=True)}</script>
</head>
<body>
    <!-- Header will be loaded dynamically -->

    <main class=\"main-content\" id=\"main-content\" role=\"main\" aria-label=\"Main content\">
        <div class=\"container\">
            <div class=\"content-grid\">
                <section class=\"main-articles\" aria-label=\"Article\">
                    <article class=\"featured-article\">
                        <h1 class=\"article-title\">{escape_attr(title)}</h1>
                        <div class=\"article-meta\">
                            <span class=\"author\">By {escape_attr(author)}</span>
                            <span class=\"separator\">|</span>
                            <time datetime=\"{iso_date}\">{date_for_display}</time>
                            <span class=\"separator\">|</span>
                            <a href=\"../index.html?category={category_query}\" style=\"color: #c41e3a; text-decoration: none; font-weight: bold;\">{escape_attr(category)}</a>
                        </div>
                        {featured_image_html}
                        <div class=\"article-content\">{body_content}</div>
                        {faq_html}
                        <div style=\"margin-top: 40px; padding-top: 30px; border-top: 2px solid #ddd;\">
                            <a href=\"../index.html\" class=\"back-to-posts-link\">← Back to All Posts</a>
                        </div>
                    </article>
                </section>
                <aside class=\"sidebar\" role=\"complementary\">
                    <div id=\"sidebar-components\"></div>
                </aside>
            </div>
        </div>
    </main>

    <!-- Footer will be loaded dynamically -->

    <script src=\"../assets/js/contact-modal.js\" defer></script>
    <script src=\"../assets/js/components.js\" defer></script>
    <script src=\"../assets/js/blog-loader.js\" defer></script>
</body>
</html>
"""


def main() -> None:
    posts = fetch_posts()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    generated = 0
    for post in posts:
        if not isinstance(post, dict):
            continue
        title = post.get("title")
        slug = slugify_title(post.get("slug") or title)
        if not slug:
            continue

        html_page = render_page(post)
        if not html_page:
            continue

        out_file = OUTPUT_DIR / f"{slug}.html"
        out_file.write_text(html_page, encoding="utf-8")
        generated += 1

    print(f"Generated {generated} static post pages in '{OUTPUT_DIR}'")


if __name__ == "__main__":
    main()
