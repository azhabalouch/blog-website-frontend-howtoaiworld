import os
import json
import urllib.request
import urllib.parse

URL = "https://azhabalouch.github.io/blogs-data-api/api.json"
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CACHE_FILE = os.path.join(BASE_DIR, "data", "cache.json")
PUBLIC_IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")


def download_image(img_url):
    if not img_url:
        return
    try:
        parts = img_url.split('/images/')
        if len(parts) > 1:
            rel_path = urllib.parse.unquote(parts[1])
            local_path = os.path.join(PUBLIC_IMAGES_DIR, rel_path)
            local_path = os.path.normpath(local_path)

            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            if not os.path.exists(local_path):
                safe_url = urllib.parse.urlsplit(img_url)
                # Ensure the path is properly quoted for spaces
                safe_url = safe_url._replace(path=urllib.parse.quote(
                    urllib.parse.unquote(safe_url.path)))
                req = urllib.request.Request(
                    safe_url.geturl(), headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response, open(
                        local_path, 'wb') as out_file:
                    out_file.write(response.read())
    except Exception as e:
        print(f"Error downloading image {img_url}: {e}")


def main():
    try:
        req = urllib.request.Request(URL,
                                     headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))

        # Ensure data directory exists
        os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)

        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

        blogs = data.get('blogs', [])
        for blog in blogs:
            slug = blog.get('slug')
            if slug:
                blog_img_dir = os.path.join(PUBLIC_IMAGES_DIR, slug)
                if os.path.exists(blog_img_dir) and os.listdir(blog_img_dir):
                    continue

            download_image(blog.get('featured_image'))
            for img in blog.get('content_images', []):
                download_image(img)

    except Exception as e:
        print(f"Error fetching data: {e}")


if __name__ == "__main__":
    main()
