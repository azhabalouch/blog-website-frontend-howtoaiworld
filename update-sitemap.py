#!/usr/bin/env python3
"""
Sitemap Updater Script
Updates lastmod dates in sitemap.xml for only the changed HTML files
Automatically detects changed files from the latest GitHub commit on main
"""

import xml.etree.ElementTree as ET
import sys
from datetime import datetime
import os
import subprocess
import json
import re
import unicodedata
from urllib.request import urlopen

BLOG_DATA_URL = 'https://azhabalouch.github.io/blogs-data-api/api.json'
BASE_URL = 'https://howtoaiworld.com'


def get_changed_files_from_commit():
    """
    Get list of changed files from the latest commit on main branch
    
    Returns:
        List of file paths that were changed in the latest commit
    """
    try:
        # Get files changed in the latest commit
        result = subprocess.run([
            'git', 'diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'
        ],
                                capture_output=True,
                                text=True,
                                check=True)
        changed_files = result.stdout.strip().split('\n')
        # Filter out empty strings
        changed_files = [f for f in changed_files if f]
        return changed_files
    except subprocess.CalledProcessError as e:
        print(f"Error getting changed files from git: {e}")
        return []
    except FileNotFoundError:
        print("Error: git command not found")
        return []


def slugify_title(title):
    """Create URL-safe slug from post title."""
    normalized = unicodedata.normalize('NFKD', str(title or ''))
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

    # API commonly uses MM//DD//YYYY format.
    if '//' in date_value:
        parts = date_value.split('//')
        if len(parts) == 3:
            try:
                month = int(parts[0])
                day = int(parts[1])
                year = int(parts[2])
                return datetime(year, month, day).strftime('%Y-%m-%d')
            except ValueError:
                return today

    for fmt in ('%Y-%m-%d', '%Y/%m/%d', '%m/%d/%Y', '%m-%d-%Y', '%B %d, %Y',
                '%b %d, %Y'):
        try:
            return datetime.strptime(date_value, fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue

    return today


def fetch_blog_posts():
    """Fetch blog data and return list of posts."""
    try:
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


def remove_dynamic_blog_entries(root, namespace):
    """Remove previously generated dynamic post URLs."""
    dynamic_prefix = f'{BASE_URL}/posts/'
    legacy_prefix = f'{BASE_URL}/blog-post.html?title='
    for url_node in list(root.findall('ns:url', namespace)):
        loc_node = url_node.find('ns:loc', namespace)
        loc_text = (loc_node.text or '') if loc_node is not None else ''
        if loc_text.startswith(dynamic_prefix) or loc_text.startswith(
                legacy_prefix):
            root.remove(url_node)


def remove_legacy_template_entry(root, namespace):
    """Remove legacy blog-post.html template URL from sitemap."""
    legacy_template = f'{BASE_URL}/blog-post.html'
    for url_node in list(root.findall('ns:url', namespace)):
        loc_node = url_node.find('ns:loc', namespace)
        if loc_node is not None and (loc_node.text or '') == legacy_template:
            root.remove(url_node)


def add_dynamic_blog_entries(root, namespace):
    """Add one sitemap entry per post using static /posts/<slug>.html URLs."""
    posts = fetch_blog_posts()
    if not posts:
        return 0

    added = 0
    for post in posts:
        title = post.get('title') if isinstance(post, dict) else None
        slug = slugify_title(title)
        if not slug:
            continue

        post_url = f'{BASE_URL}/posts/{slug}.html'
        lastmod = parse_post_date(
            post.get('date') if isinstance(post, dict) else None)

        url_elem = ET.SubElement(root, 'url')
        loc_elem = ET.SubElement(url_elem, 'loc')
        loc_elem.text = post_url

        lastmod_elem = ET.SubElement(url_elem, 'lastmod')
        lastmod_elem.text = lastmod

        changefreq_elem = ET.SubElement(url_elem, 'changefreq')
        changefreq_elem.text = 'monthly'

        priority_elem = ET.SubElement(url_elem, 'priority')
        priority_elem.text = '0.7'
        added += 1

    return added


def update_sitemap(changed_files):
    """
    Update sitemap.xml with new lastmod dates for changed files
    
    Args:
        changed_files: List of file paths that were changed
    """
    sitemap_path = 'sitemap.xml'

    if not os.path.exists(sitemap_path):
        print(f"Error: {sitemap_path} not found")
        return False

    # Parse the sitemap XML
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
    except Exception as e:
        print(f"Error parsing sitemap: {e}")
        return False

    # Define XML namespace
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')

    # Get today's date in ISO format (YYYY-MM-DD)
    today = datetime.now().strftime('%Y-%m-%d')

    # Filter for HTML files only
    html_files = [f for f in changed_files if f.endswith('.html')]

    if html_files:
        print(f"Changed HTML files: {', '.join(html_files)}")
    else:
        print("No HTML files were changed. Refreshing dynamic post URLs only.")

    updated_count = 0

    # Update lastmod for each changed file
    if html_files:
        for url in root.findall('ns:url', namespace):
            loc = url.find('ns:loc', namespace)
            lastmod = url.find('ns:lastmod', namespace)

            if loc is not None and lastmod is not None:
                url_path = loc.text.replace('https://howtoaiworld.com/', '')

                # Check if this URL matches any changed file
                for changed_file in html_files:
                    # Extract filename without path and extension
                    file_name = changed_file.replace('pages/', '').replace(
                        'legal/', '').replace('.html', '')

                    # Handle index page (root /)
                    if (changed_file == 'index.html' and url_path == ''):
                        old_date = lastmod.text
                        lastmod.text = today
                        updated_count += 1
                        print(
                            f"✓ Updated {url_path or '/'}: {old_date} → {today}"
                        )
                        break
                    # Handle pages in folders
                    elif url_path.endswith(file_name):
                        old_date = lastmod.text
                        lastmod.text = today
                        updated_count += 1
                        print(f"✓ Updated {url_path}: {old_date} → {today}")
                        break

    remove_dynamic_blog_entries(root, namespace)
    remove_legacy_template_entry(root, namespace)
    dynamic_added_count = add_dynamic_blog_entries(root, namespace)

    if updated_count > 0 or dynamic_added_count > 0:
        # Write the updated sitemap back to file
        ET.indent(tree, space='    ')
        tree.write(sitemap_path, encoding='UTF-8', xml_declaration=True)
        print(
            f"\n✅ Successfully updated {updated_count} static entries in sitemap.xml"
        )
        print(f"✅ Added {dynamic_added_count} dynamic blog entries")
        return True
    else:
        print("\n⚠️  No changes were required in sitemap.xml")
        return False


def main():
    """Main function to get changed files from latest commit and update sitemap"""
    print("=" * 60)
    print("SITEMAP UPDATER")
    print("=" * 60)

    # Get changed files from command line args or from latest git commit
    if len(sys.argv) > 1:
        changed_files = sys.argv[1:]
        print("Using files from command line arguments")
    else:
        print("Detecting changed files from latest git commit on main...")
        changed_files = get_changed_files_from_commit()

    if not changed_files:
        print("No changed files detected.")
        sys.exit(0)

    print(f"Detected files: {', '.join(changed_files)}")

    success = update_sitemap(changed_files)

    if success:
        sys.exit(0)
    else:
        sys.exit(
            0)  # Exit with 0 even if no changes to avoid failing the workflow


if __name__ == '__main__':
    main()
