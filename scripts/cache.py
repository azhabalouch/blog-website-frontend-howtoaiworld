import requests
import os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

# --- CONFIG ---
REPO_OWNER = "azhabalouch"
REPO_NAME = "blogs-data-api"
BRANCH = "main"

TOKEN = os.environ.get("API_REPO_TOKEN")

BASE_API = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents"
RAW_BASE = f"https://raw.githubusercontent.com/{REPO_OWNER}/{REPO_NAME}/{BRANCH}"

HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

# --- PATHS ---
CACHE_PATH = Path("data/cache.json")
IMAGES_ROOT = Path("public/images")

CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
IMAGES_ROOT.mkdir(parents=True, exist_ok=True)


# --- FETCH JSON ---
def fetch_api_json():
    url = f"{RAW_BASE}/api.json"
    print(f"Fetching JSON: {url}")

    res = requests.get(url, headers=HEADERS)
    res.raise_for_status()

    CACHE_PATH.write_bytes(res.content)
    print(f"Saved → {CACHE_PATH}")

    return res.json()


# --- GET FULL REPO TREE (ONE CALL) ---
def get_repo_tree():
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/git/trees/{BRANCH}?recursive=1"
    res = requests.get(url, headers=HEADERS)
    res.raise_for_status()
    return res.json().get("tree", [])


# --- DOWNLOAD FILE ---
def download_file(download_url, save_path):
    res = requests.get(download_url, headers=HEADERS)
    res.raise_for_status()

    save_path.parent.mkdir(parents=True, exist_ok=True)
    save_path.write_bytes(res.content)
    print(f"Downloaded → {save_path}")


# --- MAIN ---
def main():
    data = fetch_api_json()

    # Get the entire repo tree in ONE call
    print("Fetching repo tree...")
    tree = get_repo_tree()

    # Collect image files that need downloading
    to_download = []
    for item in tree:
        if item["type"] != "blob":
            continue
        path = item["path"]
        if not path.startswith("images/"):
            continue
        # e.g. images/slug-name/file.jpg → slug-name/file.jpg
        relative = path[len("images/"):]
        local_path = IMAGES_ROOT / relative

        if local_path.exists():
            continue

        download_url = f"{RAW_BASE}/{path}"
        to_download.append((download_url, local_path))

    if not to_download:
        print("All images up to date.")
        return

    print(f"Downloading {len(to_download)} new image(s)...")
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {
            pool.submit(download_file, url, path): path
            for url, path in to_download
        }
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                print(f"Failed: {futures[future]} — {e}")


if __name__ == "__main__":
    if not TOKEN:
        raise Exception("Missing API_REPO_TOKEN environment variable")

    main()
