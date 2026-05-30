import json
import os
import requests
import time
from urllib.parse import urljoin

# Base URL for the dragon builder assets
BASE_URL = "https://www.monsterbrainsoup.com/dragonbuilder/"

# Load style data
with open("dragon_builder_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Categories and their sub-folders
ASSET_DIRS = {
    "head": ["eyes", "snouts", "markings_snout", "brows", "jawdecor", "manes", "horns", "ears", "fangs", "whiskers", "headtop"],
    "torso": ["base", "belly", "spinedecor", "markings"],
    "legs": ["forelegs", "hindlegs", "legdecor", "markings_foreleg", "markings_hindleg"],
    "wings": ["wings", "markings_wing"],
    "tail": ["tails", "markings_tail"],
    "accessories": ["acc_neck", "acc_head", "acc_tail", "acc_torso"],
    "breath": ["breath"]
}

def download_file(url, folder):
    filename = url.split("/")[-1]
    folder_path = os.path.join("assets", folder)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    filepath = os.path.join(folder_path, filename)
    
    if os.path.exists(filepath):
        print(f"Skipping {filename} (already exists)")
        return True

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        print(f"Downloading {url}...")
        response = requests.get(url, headers=headers, stream=True, timeout=10)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Saved to {filepath}")
            time.sleep(0.5) # Be respectful to the server
            return True
        elif response.status_code == 404:
            print(f"Error 404: {url} not found")
        else:
            print(f"Error {response.status_code} for {url}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def get_style_ids(category_name):
    # Find the select options for a given category/part in the new JSON structure
    selects = data.get("selects", {})
    
    # 1. Exact match
    if category_name in selects:
        return [opt["value"] for opt in selects[category_name].get("options", []) if opt["value"] != "none"]
    
    # 2. Case-insensitive prefix match (e.g., "eye" matches "eyeStyle")
    for key, value in selects.items():
        if key.lower().startswith(category_name.lower()):
             return [opt["value"] for opt in value.get("options", []) if opt["value"] != "none"]
             
    return []

def run():
    # Directories are now created on-demand in download_file
    print("Starting comprehensive asset download...")
    
    # helper to get all matching keys
    def get_all_styles(prefix):
        all_opts = []
        selects = data.get("selects", {})
        for key, value in selects.items():
            if key.lower().startswith(prefix.lower()):
                opts = [opt["value"] for opt in value.get("options", []) if opt["value"] != "none"]
                all_opts.extend(opts)
        return list(set(all_opts))

    # 1. Base Image
    download_file(urljoin(BASE_URL, "newbases/newbase_c1.png"), "torso/base")
    download_file(urljoin(BASE_URL, "base/baselineart.png"), "torso/base")

    # 2. Eyes
    for s in get_all_styles("eye"):
        download_file(urljoin(BASE_URL, f"eyes/eyes_{s}_color.png"), "head/eyes")
        download_file(urljoin(BASE_URL, f"eyes/eyes_{s}_lines.png"), "head/eyes")

    # 3. Snouts & Snout Markings
    for s in get_all_styles("snoutStyle"):
        download_file(urljoin(BASE_URL, f"snouts/snout_{s}_color.png"), "head/snouts")
        download_file(urljoin(BASE_URL, f"snouts/snout_{s}_lines.png"), "head/snouts")
        for m in get_all_styles("snoutmarking"):
             download_file(urljoin(BASE_URL, f"markings_snout/{s}_{m}.png"), "head/markings_snout")

    # 4. Brows
    for s in get_all_styles("brow"):
        download_file(urljoin(BASE_URL, f"brows/brow_{s}_color.png"), "head/brows")
        download_file(urljoin(BASE_URL, f"brows/brow_{s}_lines.png"), "head/brows")

    # 5. Jaw Decor
    for s in get_all_styles("jawdec"):
        download_file(urljoin(BASE_URL, f"jawdecor/jawdec_{s}_color.png"), "head/jawdecor")
        download_file(urljoin(BASE_URL, f"jawdecor/jawdec_{s}_lines.png"), "head/jawdecor")

    # 6. Manes
    for s in get_all_styles("mane"):
        download_file(urljoin(BASE_URL, f"manes/mane_{s}_color.png"), "head/manes")
        download_file(urljoin(BASE_URL, f"manes/mane_{s}_lines.png"), "head/manes")

    # 7. Headtops
    for s in get_all_styles("headtop"):
        download_file(urljoin(BASE_URL, f"headtop/headtop_{s}_color.png"), "head/headtop")
        download_file(urljoin(BASE_URL, f"headtop/headtop_{s}_lines.png"), "head/headtop")

    # 8. Horns
    for s in get_all_styles("horn"):
        for loc in ["front", "rear"]:
            download_file(urljoin(BASE_URL, f"horns/horn_{s}_{loc}_color.png"), "head/horns")
            download_file(urljoin(BASE_URL, f"horns/horn_{s}_{loc}_lines.png"), "head/horns")

    # 9. Ears
    for s in get_all_styles("ear"):
        for loc in ["front", "rear"]:
            download_file(urljoin(BASE_URL, f"ears/ear_{s}_{loc}_base.png"), "head/ears")
            download_file(urljoin(BASE_URL, f"ears/ear_{s}_{loc}_lines.png"), "head/ears")
            if loc == "front":
                download_file(urljoin(BASE_URL, f"ears/ear_{s}_front_flesh.png"), "head/ears")

    # 10. Fangs
    for s in get_all_styles("fang"):
        for loc in ["front", "rear"]:
            download_file(urljoin(BASE_URL, f"fangs/fang_{s}_{loc}_color.png"), "head/fangs")
            download_file(urljoin(BASE_URL, f"fangs/fang_{s}_{loc}_lines.png"), "head/fangs")

    # 11. Whiskers
    for s in get_all_styles("whisker"):
        for loc in ["front", "rear"]:
            download_file(urljoin(BASE_URL, f"whiskers/whisker_{loc}_{s}.png"), "head/whiskers")

    # 12. Forelegs
    fstyle = get_all_styles("forelegStyle")
    fmark = get_all_styles("forelegmarking")
    fdec = get_all_styles("forelegdecStyle")
    for s in fstyle:
        for loc in ["front", "rear"]:
            download_file(urljoin(BASE_URL, f"forelegs/foreleg_{loc}_{s}_base.png"), "legs/forelegs")
            download_file(urljoin(BASE_URL, f"forelegs/foreleg_{loc}_{s}_lines.png"), "legs/forelegs")
            download_file(urljoin(BASE_URL, f"forelegs/foreleg_{loc}_{s}_flesh.png"), "legs/forelegs")
            download_file(urljoin(BASE_URL, f"forelegs/foreleg_{loc}_{s}_bone.png"), "legs/forelegs")
            for m in fmark:
                download_file(urljoin(BASE_URL, f"markings_foreleg/marking_{s}_{loc}_{m}.png"), "legs/markings_foreleg")
            for d in fdec:
                download_file(urljoin(BASE_URL, f"legdecor/fore_{s}_{loc}_{d}_color.png"), "legs/legdecor")
                download_file(urljoin(BASE_URL, f"legdecor/fore_{s}_{loc}_{d}_lines.png"), "legs/legdecor")

    # 13. Hindlegs
    hstyle = get_all_styles("hindlegStyle")
    hmark = get_all_styles("hindlegmarking")
    hdec = get_all_styles("hindlegdecStyle")
    for s in hstyle:
        for loc in ["front", "rear"]:
            download_file(urljoin(BASE_URL, f"hindlegs/hindleg_{loc}_{s}_base.png"), "legs/hindlegs")
            download_file(urljoin(BASE_URL, f"hindlegs/hindleg_{loc}_{s}_lines.png"), "legs/hindlegs")
            download_file(urljoin(BASE_URL, f"hindlegs/hindleg_{loc}_{s}_flesh.png"), "legs/hindlegs")
            download_file(urljoin(BASE_URL, f"hindlegs/hindleg_{loc}_{s}_bone.png"), "legs/hindlegs")
            for m in hmark:
                download_file(urljoin(BASE_URL, f"markings_hindleg/marking_{s}_{loc}_{m}.png"), "legs/markings_hindleg")
            for d in hdec:
                download_file(urljoin(BASE_URL, f"legdecor/hind_{s}_{loc}_{d}_color.png"), "legs/legdecor")
                download_file(urljoin(BASE_URL, f"legdecor/hind_{s}_{loc}_{d}_lines.png"), "legs/legdecor")

    # 14. Wings
    wstyle = get_all_styles("wingStyle")
    wpattern = get_all_styles("wingpattern")
    wdorsal = get_all_styles("wingmarkingdorsal")
    wventral = get_all_styles("wingmarkingventral")
    for s in wstyle:
        for loc in ["front", "rear"]:
            download_file(urljoin(BASE_URL, f"wings/wing_{s}_{loc}_base.png"), "wings/wings")
            download_file(urljoin(BASE_URL, f"wings/wing_{s}_{loc}_lines.png"), "wings/wings")
            download_file(urljoin(BASE_URL, f"wings/wing_{s}_{loc}_bone.png"), "wings/wings")
            download_file(urljoin(BASE_URL, f"wings/wing_{s}_{loc}_color.png"), "wings/wings")
            for p in wpattern:
                download_file(urljoin(BASE_URL, f"wings/wing_{s}_{loc}_color_special_{p}.png"), "wings/wings")
            for m in wdorsal:
                download_file(urljoin(BASE_URL, f"markings_wing/dorsal_{s}_{loc}_{m}.png"), "wings/markings_wing")
            for m in wventral:
                download_file(urljoin(BASE_URL, f"markings_wing/ventral_{s}_{loc}_{m}.png"), "wings/markings_wing")

    # 15. Markings (Torso)
    m_styles = list(set(get_all_styles("marking1") + get_all_styles("marking2") + get_all_styles("marking3")))
    for m in m_styles:
        download_file(urljoin(BASE_URL, f"markings/marking_{m}.png"), "torso/markings")

    # 16. Tail Markings & Decor
    for s in get_all_styles("tailmarking"):
        download_file(urljoin(BASE_URL, f"markings_tail/tailmarking_{s}.png"), "tail/markings_tail")
    for s in get_all_styles("taildecStyle"):
        download_file(urljoin(BASE_URL, f"tails/tail_{s}_color.png"), "tail/decor")
        download_file(urljoin(BASE_URL, f"tails/tail_{s}_lines.png"), "tail/decor")

    # 17. Belly
    for s in get_all_styles("belly"):
        download_file(urljoin(BASE_URL, f"belly/belly_{s}_color.png"), "torso/belly")
        download_file(urljoin(BASE_URL, f"belly/belly_{s}_lines.png"), "torso/belly")

    # 18. Spine Decor
    for s in get_all_styles("spinedec"):
        download_file(urljoin(BASE_URL, f"spinedecor/spinedec_{s}_color.png"), "torso/spinedecor")
        download_file(urljoin(BASE_URL, f"spinedecor/spinedec_{s}_lines.png"), "torso/spinedecor")

    # 19. Mouth
    for s in get_all_styles("mouthStyle"):
        download_file(urljoin(BASE_URL, f"mouth/mouth_{s}_flesh.png"), "head/mouth")
        download_file(urljoin(BASE_URL, f"mouth/mouth_{s}_bone.png"), "head/mouth")
        download_file(urljoin(BASE_URL, f"mouth/mouth_{s}_lines.png"), "head/mouth")

    # 20. Breath
    for s in get_all_styles("breath"):
        download_file(urljoin(BASE_URL, f"breath/breath_{s}.png"), "breath")

    # 21. Accessories
    acc_map = {"neckacc": "acc_neck", "headacc": "acc_head", "tailacc": "acc_tail", "torsoacc": "acc_torso"}
    for key, folder in acc_map.items():
        for s in get_all_styles(key):
            download_file(urljoin(BASE_URL, f"{folder}/{s}.png"), f"accessories/{folder}")

    print("Comprehensive download attempt finished.")

if __name__ == "__main__":
    run()
