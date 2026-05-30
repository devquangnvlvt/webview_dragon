import requests

url = "https://www.monsterbrainsoup.com/dragonbuilder/tails/tail_06_color.png"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

try:
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {response.headers}")
    if response.status_code == 200:
        with open("test_tail.png", "wb") as f:
            f.write(response.content)
        print("Success!")
    else:
        print(f"Content: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")
