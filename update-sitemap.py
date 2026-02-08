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

def get_changed_files_from_commit():
    """
    Get list of changed files from the latest commit on main branch
    
    Returns:
        List of file paths that were changed in the latest commit
    """
    try:
        # Get files changed in the latest commit
        result = subprocess.run(
            ['git', 'diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'],
            capture_output=True,
            text=True,
            check=True
        )
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
    
    if not html_files:
        print("No HTML files were changed. Sitemap not updated.")
        return False
    
    print(f"Changed HTML files: {', '.join(html_files)}")
    
    updated_count = 0
    
    # Update lastmod for each changed file
    for url in root.findall('ns:url', namespace):
        loc = url.find('ns:loc', namespace)
        lastmod = url.find('ns:lastmod', namespace)
        
        if loc is not None and lastmod is not None:
            url_path = loc.text.replace('https://howtoaiworld.com/', '')
            
            # Check if this URL matches any changed file
            for changed_file in html_files:
                # Extract filename without path and extension
                file_name = changed_file.replace('pages/', '').replace('legal/', '').replace('.html', '')
                
                # Handle index page (root /)
                if (changed_file == 'index.html' and url_path == ''):
                    old_date = lastmod.text
                    lastmod.text = today
                    updated_count += 1
                    print(f"✓ Updated {url_path or '/'}: {old_date} → {today}")
                    break
                # Handle pages in folders
                elif url_path.endswith(file_name):
                    old_date = lastmod.text
                    lastmod.text = today
                    updated_count += 1
                    print(f"✓ Updated {url_path}: {old_date} → {today}")
                    break
    
    if updated_count > 0:
        # Write the updated sitemap back to file
        tree.write(sitemap_path, encoding='UTF-8', xml_declaration=True)
        print(f"\n✅ Successfully updated {updated_count} entries in sitemap.xml")
        return True
    else:
        print("\n⚠️  No matching URLs found in sitemap for changed files")
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
        sys.exit(0)  # Exit with 0 even if no changes to avoid failing the workflow

if __name__ == '__main__':
    main()
