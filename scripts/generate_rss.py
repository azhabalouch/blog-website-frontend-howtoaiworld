#!/usr/bin/env python3
"""
Generate RSS feed for Howtoaiworld blog.
Creates an RSS 2.0 feed for content syndication.
"""

import json
import os
import urllib.parse
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

# Configuration
BASE_URL = "https://howtoaiworld.com"
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data",
                         "cache.json")
AUTHORS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data",
                            "authors.json")
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")


def load_blogs():
    """Load blogs from cache.json"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('blogs', [])
    except Exception as e:
        print(f"Error loading blogs: {e}")
        return []


def load_authors():
    """Load authors from authors.json"""
    try:
        with open(AUTHORS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading authors: {e}")
        return []


def get_author_email(author_name, authors_data):
    """Get the email of an author by name"""
    for author in authors_data:
        if author.get('name') == author_name:
            return author.get('email')
    return "contact@howtoaiworld.com"


def generate_slug(title):
    """Generate URL slug from title"""
    return title.lower().replace(" ", "-").replace("'", "").replace('"', "") \
        .replace(",", "").replace(".", "").replace("?", "").replace("!", "") \
        .replace(":", "").replace(";", "").replace("&", "and") \
        .replace("  ", " ").replace(" ", "-")


def parse_date(date_str):
    """Parse date string and return RFC 822 formatted date"""
    try:
        # Handle MM/DD/YYYY format
        parts = date_str.split('/')
        if len(parts) == 3:
            month, day, year = int(parts[0]), int(parts[1]), int(parts[2])
            dt = datetime(year, month, day)
            return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")
    except:
        pass
    # Return current date if parsing fails
    return datetime.now().strftime("%a, %d %b %Y %H:%M:%S +0000")


def generate_rss():
    """Generate RSS 2.0 feed"""
    blogs = load_blogs()
    authors_data = load_authors()

    # Create RSS root element
    rss = Element("rss")
    rss.set("version", "2.0")
    rss.set("xmlns:atom", "http://www.w3.org/2005/Atom")
    rss.set("xmlns:content", "http://purl.org/rss/1.0/modules/content/")

    # Create channel element
    channel = SubElement(rss, "channel")

    # Channel metadata
    title = SubElement(channel, "title")
    title.text = "Howtoaiworld - AI Guides & Tutorials"

    link = SubElement(channel, "link")
    link.text = BASE_URL

    description = SubElement(channel, "description")
    description.text = "Practical AI guides, honest reviews, and step-by-step tutorials for everyone. Learn AI the simple way with Howtoaiworld."

    language = SubElement(channel, "language")
    language.text = "en-us"

    last_build_date = SubElement(channel, "lastBuildDate")
    last_build_date.text = datetime.now().strftime(
        "%a, %d %b %Y %H:%M:%S +0000")

    generator = SubElement(channel, "generator")
    generator.text = "Howtoaiworld RSS Generator"

    # Atom self-link
    atom_link = SubElement(channel, "atom:link")
    atom_link.set("href", f"{BASE_URL}/rss.xml")
    atom_link.set("rel", "self")
    atom_link.set("type", "application/rss+xml")

    # Add items (blog posts)
    for blog in blogs[:20]:  # Latest 20 posts
        item = SubElement(channel, "item")

        # Title
        item_title = SubElement(item, "title")
        item_title.text = blog.get('title', '')

        # Link
        slug = blog.get('slug') or generate_slug(blog.get('title', ''))
        item_link = SubElement(item, "link")
        item_link.text = f"{BASE_URL}/blogs/{slug}"

        # GUID
        guid = SubElement(item, "guid")
        guid.set("isPermaLink", "true")
        guid.text = f"{BASE_URL}/blogs/{slug}"

        # Publication date
        pub_date = SubElement(item, "pubDate")
        pub_date.text = parse_date(blog.get('date', ''))

        # Author
        author_name = blog.get('author', 'Unknown')
        author_email = get_author_email(author_name, authors_data)
        author = SubElement(item, "author")
        author.text = f"{author_email} ({author_name})"

        # Category
        if blog.get('category'):
            category = SubElement(item, "category")
            category.text = blog.get('category', '').split('/')[0].strip()

        # Keywords as categories
        if blog.get('keywords'):
            for keyword in blog.get('keywords', [])[:5]:  # Max 5 keywords
                cat = SubElement(item, "category")
                cat.text = keyword

        # Description
        desc = SubElement(item, "description")
        excerpt = blog.get('excerpt', '')
        if excerpt:
            desc.text = f"<![CDATA[{excerpt}]]>"

        # Content (if available)
        if blog.get('content'):
            content = SubElement(item, "content:encoded")
            # Clean content for RSS
            content_text = blog.get('content', '')
            content.text = f"<![CDATA[{content_text}]]>"

        # Enclosure (featured image)
        if blog.get('featured_image'):
            image_path = blog.get('featured_image')

            # Resolve local file size if present in public directory
            local_path = os.path.join(PUBLIC_DIR, image_path.lstrip('/'))
            file_size = "0"
            if os.path.exists(local_path):
                file_size = str(os.path.getsize(local_path))

            # URL encode the path to handle spaces in filenames
            encoded_path = urllib.parse.quote(image_path)

            enclosure = SubElement(item, "enclosure")

            image_url = encoded_path
            if image_url.startswith('/'):
                image_url = f"{BASE_URL}{image_url}"
            elif not image_url.startswith('http'):
                image_url = f"{BASE_URL}/{image_url}"

            enclosure.set("url", image_url)
            enclosure.set("type", "image/jpeg")
            enclosure.set("length", file_size)

    # Convert to pretty XML
    rough_string = tostring(rss, encoding='unicode')
    reparsed = minidom.parseString(rough_string)
    xml_str = reparsed.toprettyxml(indent="  ")

    # Restore CDATA blocks that were escaped by minidom
    xml_str = xml_str.replace("&lt;![CDATA[",
                              "<![CDATA[").replace("]]&gt;", "]]>")
    return xml_str


def save_rss(content):
    """Save RSS feed to public directory"""
    filepath = os.path.join(PUBLIC_DIR, "rss.xml")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return filepath


def main():
    # Ensure public directory exists
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    blogs = load_blogs()
    rss_content = generate_rss()
    save_rss(rss_content)


if __name__ == "__main__":
    main()
