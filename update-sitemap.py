#!/usr/bin/env python3
"""
Sitemap Generator Script
Generates separate sitemaps for main pages, legal pages, and blog posts.
Generates an index sitemap (sitemap.xml) combining the separate sitemaps.
"""

import xml.etree.ElementTree as ET
from xml.dom import minidom
import sys
import os
import subprocess
import json
import re
import unicodedata
from datetime import datetime
from urllib.request import urlopen

BLOG_DATA_URL = 'https://azhabalouch.github.io/blogs-data-api/api.json'
BASE_URL = 'https://howtoaiworld.com'

MAIN_PAGES = [{
    'path': 'index.html',
    'url': '/',
    'priority': '1.0',
    'changefreq': 'daily'
}, {
    'path': 'featured.html',
    'url': '/featured.html',
    'priority': '0.8',
    'changefreq': 'weekly'
}, {
    'path': 'about.html',
    'url': '/about.html',
    'priority': '0.7',
    'changefreq': 'monthly'
}, {
    'path': 'contact.html',
    'url': '/contact.html',
    'priority': '0.7',
    'changefreq': 'monthly'
}]

LEGAL_PAGES = [{
    'path': 'privacy.html',
    'url': '/privacy.html',
    'priority': '0.4',
    'changefreq': 'yearly'
}, {
    'path': 'terms.html',
    'url': '/terms.html',
    'priority': '0.4',
    'changefreq': 'yearly'
}, {
    'path': 'disclaimer.html',
    'url': '/disclaimer.html',
    'priority': '0.4',
    'changefreq': 'yearly'
}]


def get_file_lastmod(filepath):
    """Get the last modified date of a file from Git, fallback to filesystem time."""
    try:
        # Check git commit time
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%cI', '--', filepath],
            capture_output=True,
            text=True,
            check=True)
        date_str = result.stdout.strip()
        if date_str:
            return date_str.split('T')[0]
    except Exception:
        pass

    # Fallback to local file modified time
    if os.path.exists(filepath):
        return datetime.fromtimestamp(
            os.path.getmtime(filepath)).strftime('%Y-%m-%d')
    return datetime.now().strftime('%Y-%m-%d')


def slugify_title(title):
    """Create URL-safe slug from post title."""
    if not title:
        return ''
    normalized = unicodedata.normalize('NFKD', str(title))
    ascii_text = normalized.encode('ascii', 'ignore').decode('ascii').lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', ascii_text).strip()
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug


def parse_post_date(date_text):
    """Parse post date and return YYYY-MM-DD, falling back to today."""
    today = datetime.now().strftime('%Y-%m-%d')
    if not date_text:
        return today

    date_value = str(date_text).strip()

    if '//' in date_value:
        parts = date_value.split('//')
        if len(parts) == 3:
            try:
                # Assuming format MM//DD//YYYY
                month, day, year = int(parts[0]), int(parts[1]), int(parts[2])
                return datetime(year, month, day).strftime('%Y-%m-%d')
            except ValueError:
                return today

    for fmt in ('%Y-%m-%d', '%Y/%m/%d', '%m/%d/%Y', '%m-%d-%Y', '%B %d, %Y',
                '%b %d, %Y', '%Y-%m-%dT%H:%M:%SZ'):
        try:
            date_str = date_value.split(
                'T'
            )[0] if 'T' in date_value and fmt == '%Y-%m-%d' else date_value
            return datetime.strptime(date_str, fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue

    return today


def fetch_blog_posts():
    """Fetch blog data and return list of posts."""
    try:
        # Use locally built static data if available
        if os.path.exists('assets/data/blogs.json'):
            with open('assets/data/blogs.json', 'r', encoding='utf-8') as f:
                return json.load(f)

        # Fallback to API
        with urlopen(BLOG_DATA_URL, timeout=20) as response:
            payload = json.loads(response.read().decode('utf-8'))
            if isinstance(payload, dict) and isinstance(
                    payload.get('blogs'), list):
                return payload['blogs']
            if isinstance(payload, list):
                return payload
    except Exception as e:
        print(f"Warning: unable to fetch blog data for sitemap entries: {e}")
    return []


def create_urlset():
    """Create a new XML urlset root element."""
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    root = ET.Element('urlset',
                      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    return root


def add_url_to_sitemap(root, loc_url, lastmod_date, changefreq_val,
                       priority_val):
    """Helper to append a URL node to the sitemap root."""
    url_elem = ET.SubElement(root, 'url')

    loc = ET.SubElement(url_elem, 'loc')
    loc.text = loc_url

    lastmod = ET.SubElement(url_elem, 'lastmod')
    lastmod.text = lastmod_date

    changefreq = ET.SubElement(url_elem, 'changefreq')
    changefreq.text = changefreq_val

    priority = ET.SubElement(url_elem, 'priority')
    priority.text = str(priority_val)


def generate_static_sitemap(pages, filename):
    """Generate a sitemap for a list of static pages."""
    root = create_urlset()

    for page in pages:
        lastmod = get_file_lastmod(page['path'])
        full_url = f"{BASE_URL}{page['url']}"
        add_url_to_sitemap(root, full_url, lastmod, page['changefreq'],
                           page['priority'])

    xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="    ")

    # Strip empty lines from minidom output
    lines = [line for line in xml_str.split('\n') if line.strip()]
    xml_str = '\n'.join(lines)

    with open(filename, "w", encoding="utf-8") as f:
        # Replace the minimal XML declaration with a standard one
        f.write(
            xml_str.replace('<?xml version="1.0" ?>',
                            '<?xml version="1.0" encoding="UTF-8"?>'))

    print(f"✅ Generated {filename} with {len(pages)} entries")
    return datetime.now().strftime('%Y-%m-%d')


def generate_blogs_sitemap():
    """Generate sitemap-blogs.xml purely from the blog data."""
    root = create_urlset()
    posts = fetch_blog_posts()

    added = 0
    for post in posts:
        slug = post.get('slug') if isinstance(
            post, dict) and post.get('slug') else None
        if not slug:
            title = post.get('title') if isinstance(post, dict) else None
            if not title:
                slug = str(post.get('id', ''))
            else:
                slug = slugify_title(title)

        if not slug:
            continue

        post_url = f"{BASE_URL}/blogs/{slug}/index.html"
        lastmod = parse_post_date(
            post.get('date') if isinstance(post, dict) else None)

        add_url_to_sitemap(root, post_url, lastmod, 'monthly', '0.7')
        added += 1

    xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="    ")

    # Strip empty lines from minidom output
    lines = [line for line in xml_str.split('\n') if line.strip()]
    xml_str = '\n'.join(lines)

    with open("sitemap-blogs.xml", "w", encoding="utf-8") as f:
        f.write(
            xml_str.replace('<?xml version="1.0" ?>',
                            '<?xml version="1.0" encoding="UTF-8"?>'))

    print(f"✅ Generated sitemap-blogs.xml with {added} entries")
    return datetime.now().strftime('%Y-%m-%d')


def generate_sitemap_index(sitemaps):
    """Generate the root sitemap.xml pointing to all other sitemaps."""
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    root = ET.Element('sitemapindex',
                      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    for sitemap_file, lastmod_date in sitemaps.items():
        sitemap_elem = ET.SubElement(root, 'sitemap')

        loc = ET.SubElement(sitemap_elem, 'loc')
        loc.text = f"{BASE_URL}/{sitemap_file}"

        lastmod = ET.SubElement(sitemap_elem, 'lastmod')
        lastmod.text = lastmod_date

    xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="    ")

    # Strip empty lines from minidom output
    lines = [line for line in xml_str.split('\n') if line.strip()]
    xml_str = '\n'.join(lines)

    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(
            xml_str.replace('<?xml version="1.0" ?>',
                            '<?xml version="1.0" encoding="UTF-8"?>'))

    print(
        f"✅ Generated sitemap.xml index pointing to {len(sitemaps)} sub-sitemaps"
    )


def main():
    print("=" * 60)
    print("SITEMAP REGENERATOR")
    print("=" * 60)

    sitemaps = {}

    # 1. Main Pages
    sitemaps['sitemap-main.xml'] = generate_static_sitemap(
        MAIN_PAGES, 'sitemap-main.xml')

    # 2. Legal Pages
    sitemaps['sitemap-legal.xml'] = generate_static_sitemap(
        LEGAL_PAGES, 'sitemap-legal.xml')

    # 3. Blogs
    sitemaps['sitemap-blogs.xml'] = generate_blogs_sitemap()

    # 4. Master Index
    generate_sitemap_index(sitemaps)

    print("\nAll sitemaps successfully built!")
    sys.exit(0)


if __name__ == '__main__':
    main()
