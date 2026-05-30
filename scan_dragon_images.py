"""
scan_dragon_images.py
Fetch the Dragon Builder HTML and extract all image/SVG-related URLs.
"""

import requests
from bs4 import BeautifulSoup
import re, json

URL = "https://www.monsterbrainsoup.com/dragon-builder/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
}

print("Fetching page...", flush=True)
sess = requests.Session()
r = sess.get(URL, headers=HEADERS, timeout=60)
r.raise_for_status()
html = r.text
print(f"HTML length: {len(html):,} chars", flush=True)

# Save raw HTML for offline inspection
with open("dragon_builder_raw.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Raw HTML saved to dragon_builder_raw.html", flush=True)

soup = BeautifulSoup(html, "html.parser")

# 1. All <img> tags
imgs = []
for img in soup.find_all("img"):
    src = img.get("src") or img.get("data-src") or ""
    srcset = img.get("srcset", "")
    imgs.append({"src": src, "srcset": srcset, "alt": img.get("alt","")})

print(f"\n<img> tags: {len(imgs)}", flush=True)
for i in imgs[:10]:
    print(f"  {i['src'][:120]}")

# 2. All <image> inside <svg>
svg_images = []
for img in soup.find_all("image"):
    href = img.get("href") or img.get("xlink:href") or ""
    svg_images.append(href)
print(f"\n<image> in SVG: {len(svg_images)}", flush=True)
for u in svg_images[:10]:
    print(f"  {u[:120]}")

# 3. <use> tags in SVG (sprite references)
svg_uses = []
for use in soup.find_all("use"):
    href = use.get("href") or use.get("xlink:href") or ""
    svg_uses.append(href)
print(f"\n<use> in SVG: {len(svg_uses)}", flush=True)
for u in svg_uses[:10]:
    print(f"  {u[:100]}")

# 4. Scan inline scripts for image file paths
inline_scripts = [tag.get_text() for tag in soup.find_all("script") if not tag.get("src")]
all_inline = "\n".join(inline_scripts)

file_refs = set()
for pat in [
    r'[\'"`](https?://[^\'"` ]+\.(?:svg|png|jpg|jpeg|webp)[^\'"` \)]*)[\'"`]',
    r'[\'"`](/[^\'"` ]+\.(?:svg|png|jpg|jpeg|webp)[^\'"` \)]*)[\'"`]',
]:
    file_refs.update(re.findall(pat, all_inline))
file_refs = sorted(file_refs)
print(f"\nFile refs in inline scripts: {len(file_refs)}", flush=True)
for f in file_refs[:20]:
    print(f"  {f[:120]}")

# 5. wp-content/uploads URLs in full HTML
wp_uploads = list(set(re.findall(r'https?://[^\s\'"<>]+/wp-content/uploads/[^\s\'"<>]+', html)))
print(f"\nwp-content/uploads URLs: {len(wp_uploads)}", flush=True)
for u in sorted(wp_uploads)[:20]:
    print(f"  {u[:120]}")

# 6. SVG elements summary
svgs = soup.find_all("svg")
print(f"\n<svg> elements: {len(svgs)}", flush=True)
for s in svgs:
    sid = s.get("id", "(no id)")
    w = s.get("width", "?")
    h = s.get("height", "?")
    paths = len(s.find_all("path"))
    groups = len(s.find_all("g"))
    print(f"  svg#{sid} [{w}x{h}] paths={paths} groups={groups}")

# 7. Look for any src/href pattern referencing image-like CDN paths in full HTML
cdn_matches = list(set(re.findall(
    r'https?://[^\s\'"<>]*(?:cdn|assets|images|img|media|static)[^\s\'"<>]*\.(?:svg|png|jpg|jpeg|webp)',
    html
)))
print(f"\nCDN image URLs: {len(cdn_matches)}", flush=True)
for u in sorted(cdn_matches)[:20]:
    print(f"  {u[:120]}")

# Save summary
data = {
    "img_tags": imgs,
    "svg_image_tags": svg_images,
    "svg_use_tags": svg_uses,
    "inline_script_file_refs": file_refs,
    "wp_uploads_urls": sorted(wp_uploads),
    "cdn_image_urls": sorted(cdn_matches),
    "svg_count": len(svgs),
}
with open("dragon_image_scan.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("\nScan saved to dragon_image_scan.json", flush=True)
