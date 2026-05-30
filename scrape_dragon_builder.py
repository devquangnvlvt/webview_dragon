"""
Scraper for Dragon Builder - https://www.monsterbrainsoup.com/dragon-builder/
Extracts all body part options (select elements) and script sources.
Saves output to dragon_builder_data.json.
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import os

URL = "https://www.monsterbrainsoup.com/dragon-builder/"
OUTPUT_FILE = "dragon_builder_data.json"
OUTPUT_DIR = "."

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


def fetch_page(url):
    print(f"Fetching {url}...")
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    print(f"Status: {response.status_code}")
    return response.text


def extract_selects(soup):
    """Extract all <select> tags with their options."""
    selects_data = {}
    select_tags = soup.find_all("select")
    print(f"\nFound {len(select_tags)} <select> elements:")
    for i, sel in enumerate(select_tags):
        sel_id = sel.get("id", sel.get("name", f"unnamed_{i}"))
        options = []
        for opt in sel.find_all("option"):
            options.append({
                "value": opt.get("value", ""),
                "text": opt.get_text(strip=True),
            })
        print(f"  - #{sel_id}: {len(options)} options")
        selects_data[sel_id] = {
            "id": sel_id,
            "name": sel.get("name", ""),
            "options": options,
        }
    return selects_data


def extract_scripts(soup, base_url):
    """Extract all <script> tag src URLs and inline script content."""
    scripts_info = []
    script_tags = soup.find_all("script")
    print(f"\nFound {len(script_tags)} <script> elements:")
    for tag in script_tags:
        src = tag.get("src")
        if src:
            full_src = src if src.startswith("http") else base_url.rstrip("/") + ("/" if not src.startswith("/") else "") + src
            print(f"  [external] {full_src}")
            scripts_info.append({"type": "external", "src": full_src})
        else:
            content = tag.get_text()[:300].strip()
            if content:
                print(f"  [inline] {content[:100]}...")
                scripts_info.append({"type": "inline", "preview": content[:300]})
    return scripts_info


def fetch_js_data(script_infos):
    """Attempt to download external JS files and scan for useful data."""
    js_data = {}
    skippable = ["analytics", "fonts", "jquery.min", "wp-emoji", "gtag", "recaptcha"]
    for entry in script_infos:
        if entry["type"] != "external":
            continue
        url = entry["src"]
        if any(skip in url for skip in skippable):
            print(f"  Skipping: {url}")
            continue
        try:
            print(f"\n  Downloading JS: {url}")
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()
            content = r.text
            info = dict(entry)
            info["size"] = len(content)
            info["preview"] = content[:500]
            # Try to find SVG path data patterns
            svg_matches = re.findall(r'["\']([mMlLhHvVcCsSqQtTaAzZ][^"\']{10,})["\']', content)
            if svg_matches:
                info["svg_paths_count"] = len(svg_matches)
                info["svg_paths_sample"] = svg_matches[:3]
            js_data[url] = info
        except Exception as e:
            print(f"    ERROR: {e}")
            entry["error"] = str(e)
            js_data[url] = entry
    return js_data


def extract_tabs(soup):
    """Try to find tab structures to understand the navigation hierarchy."""
    tabs_data = {}
    for tab_class in ["tabsection", "tab-section", "tab", "body-part-tab"]:
        tabs = soup.find_all(class_=tab_class)
        if tabs:
            print(f"\nFound {len(tabs)} elements with class '{tab_class}'")
            tabs_data[tab_class] = [t.get_text(strip=True)[:200] for t in tabs]
    return tabs_data


def extract_color_inputs(soup):
    """Extract color picker inputs."""
    color_inputs = []
    inputs = soup.find_all("input")
    for inp in inputs:
        inp_id = inp.get("id", "")
        inp_type = inp.get("type", "")
        if inp_type == "color" or "color" in inp_id.lower():
            color_inputs.append({
                "id": inp_id,
                "type": inp_type,
                "value": inp.get("value", ""),
                "name": inp.get("name", ""),
            })
    if color_inputs:
        print(f"\nFound {len(color_inputs)} color inputs")
    return color_inputs


def main():
    html = fetch_page(URL)
    soup = BeautifulSoup(html, "html.parser")

    title = soup.find("title")
    print(f"\nPage title: {title.get_text() if title else 'N/A'}")

    selects = extract_selects(soup)
    scripts = extract_scripts(soup, URL)
    tabs = extract_tabs(soup)
    colors = extract_color_inputs(soup)
    js_data = fetch_js_data(scripts)

    result = {
        "url": URL,
        "title": title.get_text() if title else "",
        "tabs": tabs,
        "selects": selects,
        "color_inputs": colors,
        "scripts": scripts,
        "js_files": js_data,
    }

    out_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n Data saved to {out_path}")
    print(f"   Selects: {len(selects)}")
    print(f"   Scripts: {len(scripts)}")
    print(f"   Color inputs: {len(colors)}")


if __name__ == "__main__":
    main()
