const CONFIG = {
    BASE_URL: "assets/",
    CANVAS_SIZE: 1000,
    DISPLAY_SIZE: 600,
    TAB_MAPPING: {
        'head': ['snoutStyle', 'eyeStyle', 'browStyle', 'maneStyle', 'hornStyle', 'earStyle', 'fangStyle', 'jawdecStyle', 'whiskerStyle', 'headtopStyle', 'headacc'],
        'torso': ['bellyStyle', 'spinedecStyle', 'marking1Style', 'marking2Style', 'marking3Style', 'torsoacc', 'neckacc'],
        'legs': ['forelegStyleSelect', 'hindlegStyleSelect', 'forelegmarkingStyle', 'hindlegmarkingStyle', 'forelegdecStyle', 'hindlegdecStyle'],
        'wings': ['wingStyle', 'wingpatternStyle', 'wingmarkingdorsalStyle', 'wingmarkingventralStyle'],
        'tail': ['taildecStyle', 'taildecStyle2', 'tailmarkingStyle', 'tailmarking2Style', 'tailacc']
    },
    COLOR_MAPPING: {
        'head': ['baseColor', 'eyeColor', 'boneColor', 'fleshColor', 'browColor', 'snoutmarkingColor', 'snoutaddColor', 'maneColor', 'headtopColor', 'jawdecColor', 'breathColor', 'whiskerColor'],
        'torso': ['baseColor', 'bellyColor', 'spinedecColor', 'marking1Color', 'marking2Color', 'marking3Color'],
        'legs': ['baseColor', 'fleshColor', 'boneColor', 'forelegdecColor', 'forelegdecColor2', 'forelegmarkingColor', 'forelegmarking2Color', 'hindlegdecColor', 'hindlegdecColor2', 'hindlegmarkingColor', 'hindlegmarking2Color'],
        'wings': ['baseColor', 'wingColor', 'wingmarkingdorsalColor', 'wingmarkingdorsalColor2', 'wingmarkingventralColor', 'wingmarkingventralColor2'],
        'tail': ['baseColor', 'taildecColor', 'taildecColor2', 'tailmarkingColor', 'tailmarking2Color']
    }
};

const STATE = {
    data: null,
    selections: {}, // { partId: { style: '01', color: '#ff0000' } }
    activeTab: 'head',
    layers: {}, // Cached colored canvases
    imageBuffer: {} // Cached original images
};

const UI = {
    canvas: document.getElementById('dragonCanvas'),
    ctx: document.getElementById('dragonCanvas').getContext('2d'),
    tabContent: document.getElementById('tab-content'),
    tabs: document.querySelectorAll('.tab-btn'),
    loading: document.getElementById('loadingOverlay'),
    downloadBtn: document.getElementById('downloadBtn'),
    headerDownloadBtn: document.getElementById('headerDownloadBtn'),
    randomizeBtn: document.getElementById('randomizeBtn'),
    headerRandomizeBtn: document.getElementById('headerRandomizeBtn'),
    themeToggle: document.getElementById('themeToggle')
};

// --- INITIALIZATION ---

async function init() {
    try {
        const response = await fetch('dragon_builder_data.json');
        STATE.data = await response.json();
        
        setupDefaultSelections();
        setupTabs();
        setupUtilities();
        
        renderTabContent();
        await updatePreview();
    } catch (err) {
        console.error("Initialization failed:", err);
    }
}

function setupDefaultSelections() {
    // Selects
    for (let id in STATE.data.selects) {
        STATE.selections[id] = {
            style: STATE.data.selects[id].options[0].value
        };
    }
    // Colors
    STATE.data.color_inputs.forEach(ci => {
        STATE.selections[ci.id] = { color: ci.value || "#FFFFFF" };
    });
    
    // Default aesthetics
    STATE.selections['baseColor'].color = "#FFDB8F";
    STATE.selections['eyeColor'].color = "#FFFFFF";
    STATE.selections['boneColor'].color = "#8F9E67";
}

function setupTabs() {
    UI.tabs.forEach(btn => {
        btn.onclick = () => {
            UI.tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            STATE.activeTab = btn.dataset.tab;
            renderTabContent();
        };
    });
}

function setupUtilities() {
    UI.downloadBtn.onclick = UI.headerDownloadBtn.onclick = downloadPNG;
    UI.randomizeBtn.onclick = UI.headerRandomizeBtn.onclick = randomize;
    UI.themeToggle.onclick = () => document.body.classList.toggle('dark-mode');
}

// --- UI RENDERING ---

function renderTabContent() {
    UI.tabContent.innerHTML = '';
    
    const partIds = CONFIG.TAB_MAPPING[STATE.activeTab] || [];
    const colorIds = CONFIG.COLOR_MAPPING[STATE.activeTab] || [];
    
    // Filter out duplicates (baseColor appears in many) and unique them
    const uniqueColorIds = [...new Set(colorIds)];

    // 1. Render Selects
    partIds.forEach(id => {
        const partData = STATE.data.selects[id];
        if (!partData) return;

        const group = document.createElement('div');
        group.className = 'control-group';
        
        const label = document.createElement('label');
        label.textContent = partData.id.replace('Style', '').replace('Select', '');
        group.appendChild(label);

        const select = document.createElement('select');
        partData.options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.value;
            el.textContent = opt.text;
            if (STATE.selections[id].style === opt.value) el.selected = true;
            select.appendChild(el);
        });

        select.onchange = (e) => {
            STATE.selections[id].style = e.target.value;
            updatePreview();
        };

        group.appendChild(select);
        UI.tabContent.appendChild(group);
    });

    // 2. Render Color Inputs
    uniqueColorIds.forEach(id => {
        const colorData = STATE.data.color_inputs.find(ci => ci.id === id);
        if (!colorData) return;

        const group = document.createElement('div');
        group.className = 'control-group';

        const label = document.createElement('label');
        label.textContent = colorData.id.replace('Color', '') + " Color";
        group.appendChild(label);

        const row = document.createElement('div');
        row.className = 'input-row';

        const picker = document.createElement('input');
        picker.type = 'color';
        picker.value = STATE.selections[id].color;

        const hex = document.createElement('input');
        hex.type = 'text';
        hex.className = 'hex-input';
        hex.value = STATE.selections[id].color;

        picker.oninput = (e) => {
            STATE.selections[id].color = e.target.value;
            hex.value = e.target.value.toUpperCase();
            updatePreview();
        };

        hex.oninput = (e) => {
            let val = e.target.value;
            if (!val.startsWith('#')) val = '#' + val;
            if (/^#[0-9A-F]{6}$/i.test(val)) {
                STATE.selections[id].color = val;
                picker.value = val;
                updatePreview();
            }
        };

        row.appendChild(picker);
        row.appendChild(hex);
        group.appendChild(row);
        UI.tabContent.appendChild(group);
    });
}

// --- RENDERING LOGIC ---

async function updatePreview() {
    UI.loading.classList.remove('hidden');
    
    const drawOrder = getDrawOrder();
    UI.ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);
    
    // Resolve all images first to detect dimensions
    const layers = await Promise.all(drawOrder.map(async (l) => ({
        img: await getLayerImage(l.path, l.color),
        path: l.path
    })));
    
    // Find first valid image to get natural dimensions
    const reference = layers.find(l => l.img);
    if (!reference) {
        UI.loading.classList.add('hidden');
        return;
    }
    
    const assetW = reference.img.width;
    const assetH = reference.img.height;
    
    // Calculate dynamic scale to fit within 50% - 80% of canvas (allowing for huge wings)
    // We'll target fitting the asset into 75% of the canvas for extreme safety
    const targetDim = UI.canvas.width * 0.75;
    const scale = Math.min(targetDim / assetW, targetDim / assetH);
    
    const offsetW = (UI.canvas.width - (assetW * scale)) / 2;
    const offsetH = (UI.canvas.height - (assetH * scale)) / 2;
    
    UI.ctx.save();
    UI.ctx.translate(offsetW, offsetH);
    UI.ctx.scale(scale, scale);
    
    layers.forEach(l => {
        if (l.img) UI.ctx.drawImage(l.img, 0, 0);
    });
    
    UI.ctx.restore();
    UI.loading.classList.add('hidden');
}

function getDrawOrder() {
    const s = STATE.selections;
    const order = [];

    const add = (path, colorKey) => {
        if (!path || path.includes('none') || path.includes('undefined')) return;
        order.push({ path: CONFIG.BASE_URL + path, color: s[colorKey]?.color || null });
    };

    const hl = s.hindlegStyleSelect.style;
    const fl = s.forelegStyleSelect.style;
    const w = s.wingStyle.style;
    const sn = s.snoutStyle.style;
    const eye = s.eyeStyle.style;
    const brow = s.browStyle.style;
    const mane = s.maneStyle.style;
    const horn = s.hornStyle.style;
    const ear = s.earStyle.style;
    const fang = s.fangStyle.style;
    const jaw = s.jawdecStyle.style;
    const whisker = s.whiskerStyle.style;
    const belly = s.bellyStyle.style;
    const spine = s.spinedecStyle.style;
    const mouth = s.mouthStyle.style;

    // Drawing logic to preserve the dragon assembly
    // [Same as original builder.js logic]
    if (hl !== 'none') {
        add(`legs/hindlegs/hindleg_rear_${hl}_base.png`, 'baseColor');
        add(`legs/markings_hindleg/marking_${hl}_rear_${s.hindlegmarkingStyle.style}.png`, 'hindlegmarkingColor');
        add(`legs/hindlegs/hindleg_rear_${hl}_bone.png`, 'boneColor');
        add(`legs/hindlegs/hindleg_rear_${hl}_flesh.png`, 'fleshColor');
        add(`legs/hindlegs/hindleg_rear_${hl}_lines.png`, null);
    }
    if (fl !== 'none') {
        add(`legs/forelegs/foreleg_rear_${fl}_base.png`, 'baseColor');
        add(`legs/forelegs/foreleg_rear_${fl}_bone.png`, 'boneColor');
        add(`legs/forelegs/foreleg_rear_${fl}_flesh.png`, 'fleshColor');
        add(`legs/forelegs/foreleg_rear_${fl}_lines.png`, null);
    }
    if (w !== 'none') {
        add(`wings/wings/wing_${w}_rear_base.png`, 'baseColor');
        add(`wings/wings/wing_${w}_rear_color.png`, 'wingColor');
        add(`wings/wings/wing_${w}_rear_bone.png`, 'boneColor');
        add(`wings/wings/wing_${w}_rear_lines.png`, null);
    }
    add(`torso/base/newbase_c1.png`, 'baseColor');
    add(`torso/markings/marking_${s.marking1Style.style}.png`, 'marking1Color');
    add(`torso/markings/marking_${s.marking2Style.style}.png`, 'marking2Color');
    add(`torso/markings/marking_${s.marking3Style.style}.png`, 'marking3Color');
    add(`tail/markings_tail/tailmarking_${s.tailmarkingStyle.style}.png`, 'tailmarkingColor');
    add(`tail/markings_tail/tailmarking_${s.tailmarking2Style?.style}.png`, 'tailmarking2Color');
    add(`torso/base/baselineart.png`, null);
    add(`torso/belly/belly_${belly}_color.png`, 'bellyColor');
    add(`torso/belly/belly_${belly}_lines.png`, null);
    add(`head/snouts/snout_${sn}_color.png`, 'baseColor');
    add(`head/markings_snout/${sn}_${s.snoutmarkingStyle.style}.png`, 'snoutmarkingColor');
    add(`head/snouts/snout_${sn}_lines.png`, null);
    add(`head/mouth/mouth_neutral_flesh.png`, 'fleshColor'); // Using neutral mouth as fallback
    add(`head/mouth/mouth_neutral_bone.png`, 'boneColor');
    add(`head/mouth/mouth_neutral_lines.png`, null);
    add(`head/eyes/eyes_${eye}_color.png`, 'eyeColor');
    add(`head/eyes/eyes_${eye}_lines.png`, null);
    add(`head/brows/brow_${brow}_color.png`, 'browColor');
    add(`head/brows/brow_${brow}_lines.png`, null);
    add(`head/manes/mane_${mane}_color.png`, 'maneColor');
    add(`head/manes/mane_${mane}_lines.png`, null);
    add(`torso/spinedecor/spinedec_${spine}_color.png`, 'spinedecColor');
    add(`torso/spinedecor/spinedec_${spine}_lines.png`, null);
    add(`accessories/acc_tail/${s.tailacc?.style}.png`, null);
    if (hl !== 'none') {
        add(`legs/hindlegs/hindleg_front_${hl}_base.png`, 'baseColor');
        add(`legs/markings_hindleg/marking_${hl}_front_${s.hindlegmarkingStyle.style}.png`, 'hindlegmarkingColor');
        add(`legs/hindlegs/hindleg_front_${hl}_bone.png`, 'boneColor');
        add(`legs/hindlegs/hindleg_front_${hl}_flesh.png`, 'fleshColor');
        add(`legs/hindlegs/hindleg_front_${hl}_lines.png`, null);
    }
    add(`accessories/acc_torso/${s.torsoacc?.style}.png`, null);
    if (w !== 'none') {
        add(`wings/wings/wing_${w}_front_base.png`, 'baseColor');
        add(`wings/wings/wing_${w}_front_color.png`, 'wingColor');
        add(`wings/wings/wing_${w}_front_bone.png`, 'boneColor');
        add(`wings/wings/wing_${w}_front_lines.png`, null);
    }
    add(`head/ears/ear_${ear}_front_base.png`, 'baseColor');
    add(`head/ears/ear_${ear}_front_flesh.png`, 'fleshColor');
    add(`head/ears/ear_${ear}_front_lines.png`, null);
    add(`head/jawdecor/jawdec_${jaw}_color.png`, 'jawdecColor');
    add(`head/jawdecor/jawdec_${jaw}_lines.png`, null);
    add(`head/headtop/headtop_${s.headtopStyle.style}_color.png`, 'headtopColor');
    add(`head/headtop/headtop_${s.headtopStyle.style}_lines.png`, null);
    add(`head/horns/horn_${horn}_front_color.png`, 'boneColor');
    add(`head/horns/horn_${horn}_front_lines.png`, null);
    add(`tail/decor/tail_${s.taildecStyle.style}_color.png`, 'taildecColor');
    add(`tail/decor/tail_${s.taildecStyle.style}_lines.png`, null);
    add(`tail/decor/tail_${s.taildecStyle2.style}_color.png`, 'taildecColor2');
    add(`tail/decor/tail_${s.taildecStyle2.style}_lines.png`, null);
    if (fl !== 'none') {
        add(`legs/forelegs/foreleg_front_${fl}_base.png`, 'baseColor');
        add(`legs/markings_foreleg/marking_${fl}_front_${s.forelegmarkingStyle.style}.png`, 'forelegmarkingColor');
        add(`legs/forelegs/foreleg_front_${fl}_bone.png`, 'boneColor');
        add(`legs/forelegs/foreleg_front_${fl}_flesh.png`, 'fleshColor');
        add(`legs/forelegs/foreleg_front_${fl}_lines.png`, null);
    }
    add(`accessories/acc_neck/${s.neckacc?.style}.png`, null);
    add(`accessories/acc_head/${s.headacc?.style}.png`, null);
    add(`head/whiskers/whisker_front_${whisker}.png`, 'whiskerColor');
    add(`breath/breath_${s.breath?.style}.png`, 'breathColor');

    return order;
}

async function getLayerImage(path, color) {
    const cacheKey = `${path}_${color || 'none'}`;
    if (STATE.layers[cacheKey]) return STATE.layers[cacheKey];

    const img = await loadImage(path);
    if (!img) return null;

    if (!color) {
        STATE.layers[cacheKey] = img;
        return img;
    }

    const coloredCanvas = recolorImage(img, color);
    STATE.layers[cacheKey] = coloredCanvas;
    return coloredCanvas;
}

function loadImage(src) {
    if (STATE.imageBuffer[src]) return Promise.resolve(STATE.imageBuffer[src]);
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            STATE.imageBuffer[src] = img;
            resolve(img);
        };
        img.onerror = () => {
            console.warn("Failed to load:", src);
            resolve(null);
        };
        img.src = src;
    });
}

function recolorImage(img, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    if (color === "#FFFFFF" || color === "#ffffff" || !color) return canvas;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 10) {
            data[i] = r;
            data[i+1] = g;
            data[i+2] = b;
        }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

function downloadPNG() {
    const link = document.createElement('a');
    link.download = 'my-dragon.png';
    link.href = UI.canvas.toDataURL("image/png");
    link.click();
}

function randomize() {
    for (let id in STATE.data.selects) {
        const options = STATE.data.selects[id].options;
        STATE.selections[id].style = options[Math.floor(Math.random() * options.length)].value;
    }
    STATE.data.color_inputs.forEach(ci => {
        STATE.selections[ci.id].color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    });
    renderTabContent();
    updatePreview();
}

init();
