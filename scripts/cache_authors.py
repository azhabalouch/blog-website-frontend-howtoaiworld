import os
import json
import urllib.request

URL = "https://azhabalouch.github.io/blogs-data-api/authors.json"
CACHE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data",
                          "authors.json")


def main():
    print(f"Fetching blogs data from {URL}...")
    try:
        response = urllib.request.urlopen(URL)
        data = json.loads(response.read().decode('utf-8'))

        # Ensure data directory exists
        os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)

        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

        print(f"Successfully saved to {CACHE_FILE}")
    except Exception as e:
        print(f"Error fetching data: {e}")


if __name__ == "__main__":
    main()
