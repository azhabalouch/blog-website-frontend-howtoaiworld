#!/usr/bin/env python3
"""
Generate sitemaps for Google AdSense crawling.
Creates separate sitemaps for different content types + a sitemap index.
"""

import json
import os
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

# Configuration
BASE_URL = "https://howtoaiworld.com"  # Change to your domain
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data",
                         "cache.json")
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")
BLOGS_PER_PAGE = 9


def load_blogs():
    """Load blogs from cache.json"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('blogs', [])
    except Exception as e:
        print(f"Error loading blogs: {e}")
        return []


import re


def generate_slug(title):
    """Generate URL slug from title matching JS regex"""
    val = title.lower()
    val = re.sub(r'[^a-z0-9]+', '-', val)
    return re.sub(r'(^-|-$)+', '', val)


def create_url_element(parent,
                       loc,
                       lastmod=None,
                       changefreq=None,
                       priority=None):
    """Create a URL element in the sitemap"""
    url = SubElement(parent, "url")
    loc_elem = SubElement(url, "loc")
    loc_elem.text = loc

    if lastmod:
        lastmod_elem = SubElement(url, "lastmod")
        lastmod_elem.text = lastmod

    if changefreq:
        changefreq_elem = SubElement(url, "changefreq")
        changefreq_elem.text = changefreq

    if priority:
        priority_elem = SubElement(url, "priority")
        priority_elem.text = str(priority)

    return url


def prettify_xml(elem):
    """Return a pretty-printed XML string"""
    rough_string = tostring(elem, encoding='unicode')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ", encoding="UTF-8").decode("utf-8")


def generate_main_sitemap():
    """Generate sitemap for main pages"""
    urlset = Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    urlset.set("xmlns:xhtml", "http://www.w3.org/1999/xhtml")

    today = datetime.now().strftime("%Y-%m-%d")

    # Main pages with their priorities
    main_pages = [
        ("", "1.0", "daily"),  # Homepage
        ("/about", "0.8", "weekly"),  # About
        ("/contact", "0.7", "monthly"),  # Contact
        ("/blogs", "0.9", "daily"),  # Blogs listing
        ("/authors", "0.8", "weekly"),  # Authors listing
    ]

    for path, priority, changefreq in main_pages:
        loc = f"{BASE_URL}{path}"
        create_url_element(urlset, loc, today, changefreq, priority)

    xml_content = prettify_xml(urlset)
    return xml_content


def generate_legal_sitemap():
    """Generate sitemap for legal pages"""
    urlset = Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    today = datetime.now().strftime("%Y-%m-%d")

    # Legal pages
    legal_pages = [
        ("/legal/privacy", "0.5", "monthly"),
        ("/legal/terms", "0.5", "monthly"),
        ("/legal/disclaimer", "0.5", "monthly"),
    ]

    for path, priority, changefreq in legal_pages:
        loc = f"{BASE_URL}{path}"
        create_url_element(urlset, loc, today, changefreq, priority)

    xml_content = prettify_xml(urlset)
    return xml_content


def generate_blog_sitemap():
    """Generate sitemap for all blog posts and pagination"""
    urlset = Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    blogs = load_blogs()
    today = datetime.now().strftime("%Y-%m-%d")

    # Calculate total pages for pagination
    total_blogs = len(blogs)
    total_pages = (total_blogs + BLOGS_PER_PAGE - 1) // BLOGS_PER_PAGE

    # Add pagination pages
    for page in range(1, total_pages + 1):
        if page == 1:
            loc = f"{BASE_URL}/blogs"
        else:
            loc = f"{BASE_URL}/blogs?page={page}"

        # Lower priority for deeper pages
        priority = max(0.4, 0.7 - (page - 1) * 0.1)
        create_url_element(urlset, loc, today, "daily", round(priority, 1))

    # Add individual blog posts
    for blog in blogs:
        slug = blog.get('slug') or generate_slug(blog.get('title', ''))
        if not slug:
            continue

        loc = f"{BASE_URL}/blogs/{slug}"

        # Use blog date if available, otherwise today
        blog_date = blog.get('date', '')
        if blog_date:
            try:
                # Handle MM/DD/YYYY format
                parts = blog_date.split('/')
                if len(parts) == 3:
                    lastmod = f"{parts[2]}-{parts[0].zfill(2)}-{parts[1].zfill(2)}"
                else:
                    lastmod = today
            except:
                lastmod = today
        else:
            lastmod = today

        create_url_element(urlset, loc, lastmod, "weekly", "0.8")

    xml_content = prettify_xml(urlset)
    return xml_content


def generate_author_sitemap():
    """Generate sitemap for author pages"""
    urlset = Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    blogs = load_blogs()
    today = datetime.now().strftime("%Y-%m-%d")

    # Get unique authors
    authors = set()
    for blog in blogs:
        author = blog.get('author', '').strip()
        if author:
            authors.add(author)

    # Add author listing page
    create_url_element(urlset, f"{BASE_URL}/authors", today, "weekly", "0.8")

    # Add individual author pages
    for author in sorted(authors):
        author_slug = generate_slug(author)
        if author_slug:
            loc = f"{BASE_URL}/authors/{author_slug}"
            create_url_element(urlset, loc, today, "weekly", "0.6")

    xml_content = prettify_xml(urlset)
    return xml_content


def generate_sitemap_index(sitemaps):
    """Generate sitemap index file"""
    sitemapindex = Element("sitemapindex")
    sitemapindex.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    today = datetime.now().strftime("%Y-%m-%d")

    for sitemap_file in sitemaps:
        sitemap_elem = SubElement(sitemapindex, "sitemap")
        loc = SubElement(sitemap_elem, "loc")
        loc.text = f"{BASE_URL}/{sitemap_file}"
        lastmod = SubElement(sitemap_elem, "lastmod")
        lastmod.text = today

    xml_content = prettify_xml(sitemapindex)
    return xml_content


def save_sitemap(filename, content):
    """Save sitemap to public directory"""
    filepath = os.path.join(PUBLIC_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  Created: {filename}")
    return filepath


def main():
    print("=" * 60)
    print("Generating Sitemaps for Google AdSense")
    print("=" * 60)

    # Ensure public directory exists
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    blogs = load_blogs()
    print(f"\nLoaded {len(blogs)} blogs from cache.json")

    # Generate all sitemaps
    sitemap_files = []

    print("\n1. Generating main pages sitemap...")
    main_xml = generate_main_sitemap()
    save_sitemap("sitemap-main.xml", main_xml)
    sitemap_files.append("sitemap-main.xml")

    print("2. Generating legal pages sitemap...")
    legal_xml = generate_legal_sitemap()
    save_sitemap("sitemap-legal.xml", legal_xml)
    sitemap_files.append("sitemap-legal.xml")

    print("3. Generating blogs sitemap...")
    blog_xml = generate_blog_sitemap()
    save_sitemap("sitemap-blogs.xml", blog_xml)
    sitemap_files.append("sitemap-blogs.xml")

    print("4. Generating authors sitemap...")
    author_xml = generate_author_sitemap()
    save_sitemap("sitemap-authors.xml", author_xml)
    sitemap_files.append("sitemap-authors.xml")

    print("5. Generating sitemap index...")
    index_xml = generate_sitemap_index(sitemap_files)
    save_sitemap("sitemap.xml", index_xml)

    print("\n" + "=" * 60)
    print("Sitemaps generated successfully!")
    print("=" * 60)
    print(f"\nFiles created in {PUBLIC_DIR}:")
    print("  - sitemap.xml (index)")
    for sf in sitemap_files:
        print(f"  - {sf}")

    print(f"\nSubmit to Google Search Console:")
    print(f"  {BASE_URL}/sitemap.xml")
    print("\nAdd to robots.txt:")
    print(f"  Sitemap: {BASE_URL}/sitemap.xml")


if __name__ == "__main__":
    main()
