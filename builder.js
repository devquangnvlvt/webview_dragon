// ============================================================
//  Dragon Builder — Game-style UI
// ============================================================

const CONFIG = {
    BASE_URL: "assets/",
    CANVAS_SIZE: 1500,
    THUMB_SIZE: 120,          // px for thumbnail offscreen canvas

    // Each entry: { partId, colorId } — rendered as one row (color wheel + thumb strip)
    // colorId: null means no color picker for that trait
    TAB_ROWS: {
        head: [
            { partId: 'eyeStyle',      colorId: 'eyeColor',     label: 'Eyes' },
            { partId: 'browStyle',     colorId: 'browColor',    label: 'Brows' },
            { partId: 'snoutStyle',    colorId: 'baseColor',    label: 'Snout Shape' },
            { partId: 'maneStyle',     colorId: 'maneColor',    label: 'Mane' },
            { partId: 'hornStyle',     colorId: 'boneColor',    label: 'Horns' },
            { partId: 'earStyle',      colorId: 'fleshColor',   label: 'Ears' },
            { partId: 'fangStyle',     colorId: 'boneColor',    label: 'Fangs' },
            { partId: 'jawdecStyle',   colorId: 'jawdecColor',  label: 'Jaw Decor' },
            { partId: 'whiskerStyle',  colorId: 'whiskerColor', label: 'Whiskers' },
            { partId: 'headtopStyle',  colorId: 'headtopColor', label: 'Head Top' },
            { partId: 'headacc',       colorId: null,           label: 'Head Accessory' },
            { partId: 'breath',        colorId: 'breathColor',  label: 'Breath' },
        ],
        torso: [
            { partId: 'bellyStyle',    colorId: 'bellyColor',   label: 'Belly' },
            { partId: 'spinedecStyle', colorId: 'spinedecColor',label: 'Spine Decor' },
            { partId: 'marking1Style', colorId: 'marking1Color',label: 'Marking 1' },
            { partId: 'marking2Style', colorId: 'marking2Color',label: 'Marking 2' },
            { partId: 'marking3Style', colorId: 'marking3Color',label: 'Marking 3' },
            { partId: 'torsoacc',      colorId: null,           label: 'Torso Accessory' },
            { partId: 'neckacc',       colorId: null,           label: 'Neck Accessory' },
        ],
        legs: [
            { partId: 'forelegStyleSelect',  colorId: 'baseColor',          label: 'Forelegs' },
            { partId: 'hindlegStyleSelect',  colorId: 'baseColor',          label: 'Hindlegs' },
            { partId: 'forelegmarkingStyle', colorId: 'forelegmarkingColor', label: 'Foreleg Marking' },
            { partId: 'hindlegmarkingStyle', colorId: 'hindlegmarkingColor', label: 'Hindleg Marking' },
        ],
        wings: [
            { partId: 'wingStyle',              colorId: 'wingColor',              label: 'Wings' },
            { partId: 'wingmarkingdorsalStyle',  colorId: 'wingmarkingdorsalColor', label: 'Wing Marking (Dorsal)' },
            { partId: 'wingmarkingventralStyle', colorId: 'wingmarkingventralColor',label: 'Wing Marking (Ventral)' },
        ],
        tail: [
            { partId: 'taildecStyle',    colorId: 'taildecColor',   label: 'Tail Decor 1' },
            { partId: 'taildecStyle2',   colorId: 'taildecColor2',  label: 'Tail Decor 2' },
            { partId: 'tailmarkingStyle',colorId: 'tailmarkingColor',label: 'Tail Marking 1' },
            { partId: 'tailmarking2Style',colorId:'tailmarking2Color',label: 'Tail Marking 2' },
            { partId: 'tailacc',         colorId: null,             label: 'Tail Accessory' },
        ],
    },

    // Keep for backward compat with getDrawOrder
    TAB_MAPPING: {
        head:  ['eyeStyle','browStyle','snoutStyle','maneStyle','hornStyle','earStyle','fangStyle','jawdecStyle','whiskerStyle','headtopStyle','headacc','breath'],
        torso: ['bellyStyle','spinedecStyle','marking1Style','marking2Style','marking3Style','torsoacc','neckacc'],
        legs:  ['forelegStyleSelect','hindlegStyleSelect','forelegmarkingStyle','hindlegmarkingStyle'],
        wings: ['wingStyle','wingmarkingdorsalStyle','wingmarkingventralStyle'],
        tail:  ['taildecStyle','taildecStyle2','tailmarkingStyle','tailmarking2Style','tailacc']
    },

    // Thumbnail: color layer so cards show colored previews
    THUMB_PATH: {
        eyeStyle:               (v) => v === 'none' ? null : `head/eyes/eyes_${v}_color.png`,
        browStyle:              (v) => v === 'none' ? null : `head/brows/brow_${v}_color.png`,
        snoutStyle:             (v) => v === 'none' ? null : `head/snouts/snout_${v}_color.png`,
        maneStyle:              (v) => v === 'none' ? null : `head/manes/mane_${v}_color.png`,
        hornStyle:              (v) => v === 'none' ? null : `head/horns/horn_${v}_front_color.png`,
        earStyle:               (v) => v === 'none' ? null : `head/ears/ear_${v}_front_base.png`,
        fangStyle:              (v) => v === 'none' ? null : `head/fangs/fang_${v}_lines.png`,
        jawdecStyle:            (v) => v === 'none' ? null : `head/jawdecor/jawdec_${v}_color.png`,
        whiskerStyle:           (v) => v === 'none' ? null : `head/whiskers/whisker_front_${v}.png`,
        headtopStyle:           (v) => v === 'none' ? null : `head/headtop/headtop_${v}_color.png`,
        headacc:                (v) => v === 'none' ? null : `accessories/acc_head/${v}.png`,
        breath:                 (v) => v === 'none' ? null : `breath/breath_${v}.png`,
        bellyStyle:             (v) => v === 'none' ? null : `torso/belly/belly_${v}_color.png`,
        spinedecStyle:          (v) => v === 'none' ? null : `torso/spinedecor/spinedec_${v}_color.png`,
        marking1Style:          (v) => v === 'none' ? null : `torso/markings/marking_${v}.png`,
        marking2Style:          (v) => v === 'none' ? null : `torso/markings/marking_${v}.png`,
        marking3Style:          (v) => v === 'none' ? null : `torso/markings/marking_${v}.png`,
        torsoacc:               (v) => v === 'none' ? null : `accessories/acc_torso/${v}.png`,
        neckacc:                (v) => v === 'none' ? null : `accessories/acc_neck/${v}.png`,
        forelegStyleSelect:     (v) => v === 'none' ? null : `legs/forelegs/foreleg_front_${v}_base.png`,
        hindlegStyleSelect:     (v) => v === 'none' ? null : `legs/hindlegs/hindleg_front_${v}_base.png`,
        forelegmarkingStyle:    (v) => v === 'none' ? null : `legs/markings_foreleg/marking_01_front_${v}.png`,
        hindlegmarkingStyle:    (v) => v === 'none' ? null : `legs/markings_hindleg/marking_01_front_${v}.png`,
        wingStyle:              (v) => v === 'none' ? null : `wings/wings/wing_${v}_front_base.png`,
        wingmarkingdorsalStyle: (v) => v === 'none' ? null : `wings/markings_wing/wingmarking_dorsal_${v}.png`,
        wingmarkingventralStyle:(v) => v === 'none' ? null : `wings/markings_wing/wingmarking_ventral_${v}.png`,
        taildecStyle:           (v) => v === 'none' ? null : `tail/decor/tail_${v}_color.png`,
        taildecStyle2:          (v) => v === 'none' ? null : `tail/decor/tail_${v}_color.png`,
        tailmarkingStyle:       (v) => v === 'none' ? null : `tail/markings_tail/tailmarking_${v}.png`,
        tailmarking2Style:      (v) => v === 'none' ? null : `tail/markings_tail/tailmarking_${v}.png`,
        tailacc:                (v) => v === 'none' ? null : `accessories/acc_tail/${v}.png`,
    }
};

const STATE = {
    data: null,
    selections: {},
    activeTab: 'head',
    imageBuffer: {},
    layers: {},
    thumbBuffer: {},

    // URL overrides từ Kotlin/API
    urlOverrides: {},

    // Transform: di chuyển, xoay, scale rồng trên canvas
    transform: {
        offsetX: 0,     // px offset từ center (canvas units)
        offsetY: 0,
        rotate: 0,      // degrees
        scale: 1.0      // multiplier (1.0 = default fit)
    }
};

// ---- DOM refs ----
const UI = {
    canvas:       document.getElementById('dragonCanvas'),
    ctx:          document.getElementById('dragonCanvas').getContext('2d'),
    panelContent: document.getElementById('panelContent'),
    tabs:         document.querySelectorAll('.btab'),
    loading:      document.getElementById('loadingOverlay'),
    randomTraits: document.getElementById('randomTraitsBtn'),
    randomColor:  document.getElementById('randomColorBtn'),
    topRand:      document.getElementById('topRandBtn'),
    nextBtn:      document.getElementById('nextBtn'),
    backBtn:      document.getElementById('backBtn'),
    addBtn:       document.getElementById('addBtn'),
};

// ============================================================
//  XHR fallback cho Android WebView (fetch bị block bởi CORS)
// ============================================================
function loadJsonXHR(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0) {
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch (e) {
                    reject(new Error('JSON parse error: ' + e.message));
                }
            } else {
                reject(new Error('XHR status: ' + xhr.status));
            }
        };
        xhr.onerror = () => reject(new Error('XHR network error'));
        xhr.send();
    });
}

// ============================================================
//  INIT
// ============================================================
async function init() {
    try {
        // Thử fetch thông thường trước
        let data;
        try {
            const res = await fetch('dragon_builder_data.json');
            data = await res.json();
        } catch (fetchErr) {
            // Fallback: dùng XMLHttpRequest (hoạt động tốt hơn trong Android WebView)
            console.log('[init] fetch failed, trying XHR:', fetchErr.message);
            data = await loadJsonXHR('dragon_builder_data.json');
        }
        STATE.data = data;
        setupDefaultSelections();
        setupTabs();
        setupButtons();
        renderPanel();
        await updatePreview();
    } catch (e) {
        console.error('Init failed:', e);
    }
}

function setupDefaultSelections() {
    for (let id in STATE.data.selects) {
        STATE.selections[id] = { style: STATE.data.selects[id].options[0].value };
    }
    STATE.data.color_inputs.forEach(ci => {
        STATE.selections[ci.id] = { color: ci.value || '#FFFFFF' };
    });
    // Nice defaults
    STATE.selections['baseColor'].color  = '#FFDB8F';
    STATE.selections['eyeColor'].color   = '#FFFFFF';
    STATE.selections['boneColor'].color  = '#8F9E67';
    STATE.selections['wingColor'] = STATE.selections['wingColor'] || { color: '#AACCFF' };
}

function setupTabs() {
    UI.tabs.forEach(btn => {
        btn.onclick = () => {
            UI.tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            STATE.activeTab = btn.dataset.tab;
            renderPanel();
        };
    });
}

function setupButtons() {
    UI.randomTraits.onclick = randomizeTraits;
    UI.randomColor.onclick  = randomizeColors;
    UI.topRand.onclick      = randomizeAll;
    UI.nextBtn.onclick      = downloadPNG;
    UI.backBtn.onclick      = () => history.back();
    UI.addBtn.onclick       = () => {};  // placeholder

    setupMoveControls();
}

function setupMoveControls() {
    const STEP    = 60;   // px di chuyển mỗi lần bấm (canvas units)
    const DEG     = 15;   // độ xoay mỗi lần
    const SCALE_F = 0.12; // bước scale

    const toggleBtn  = document.getElementById('moveToggleBtn');
    const movePanel  = document.getElementById('movePanel');
    const resetBtn   = document.getElementById('moveResetBtn');

    if (!toggleBtn) return;

    // Toggle show/hide
    toggleBtn.onclick = () => movePanel.classList.toggle('hidden');

    resetBtn.onclick = () => {
        STATE.transform = { offsetX: 0, offsetY: 0, rotate: 0, scale: 1.0 };
        updatePreview();
    };

    document.getElementById('moveUp').onclick    = () => { STATE.transform.offsetY -= STEP; updatePreview(); };
    document.getElementById('moveDown').onclick  = () => { STATE.transform.offsetY += STEP; updatePreview(); };
    document.getElementById('moveLeft').onclick  = () => { STATE.transform.offsetX -= STEP; updatePreview(); };
    document.getElementById('moveRight').onclick = () => { STATE.transform.offsetX += STEP; updatePreview(); };

    document.getElementById('rotateLeft').onclick  = () => { STATE.transform.rotate -= DEG; updatePreview(); };
    document.getElementById('rotateRight').onclick = () => { STATE.transform.rotate += DEG; updatePreview(); };

    document.getElementById('scaleDown').onclick = () => {
        STATE.transform.scale = Math.max(0.1, STATE.transform.scale - SCALE_F);
        updatePreview();
    };
    document.getElementById('scaleUp').onclick = () => {
        STATE.transform.scale = Math.min(5.0, STATE.transform.scale + SCALE_F);
        updatePreview();
    };
}

// ============================================================
//  PANEL RENDERING — each row: Label / [ColorWheel] [ThumbStrip]
// ============================================================
function renderPanel() {
    UI.panelContent.innerHTML = '';

    const rows = CONFIG.TAB_ROWS[STATE.activeTab] || [];

    rows.forEach(({ partId, colorId, label }) => {
        const partData = STATE.data.selects[partId];
        if (!partData) return;

        const section = document.createElement('div');
        section.className = 'trait-section';

        // Label
        const lbl = document.createElement('div');
        lbl.className = 'trait-label';
        lbl.textContent = label;
        section.appendChild(lbl);

        // Row: [color wheel?] + [thumb strip]
        const row = document.createElement('div');
        row.className = 'trait-row';

        // Color wheel (only if colorId provided)
        if (colorId) {
            const currentColor = STATE.selections[colorId]?.color || '#FFFFFF';
            const wheel = buildColorWheel(colorId, currentColor);
            row.appendChild(wheel);
        }

        // Thumbnail strip
        const strip = buildThumbStrip(partId, partData);
        row.appendChild(strip);

        section.appendChild(row);
        UI.panelContent.appendChild(section);
    });
}

// ---- Color wheel button ----
function buildColorWheel(colorId, currentColor) {
    const wrap = document.createElement('div');
    wrap.className = 'color-wheel-btn';
    wrap.title = 'Pick color';

    // Show current color as a small dot in center
    const dot = document.createElement('div');
    dot.className = 'color-wheel-dot';
    dot.style.background = currentColor;
    wrap.appendChild(dot);

    const picker = document.createElement('input');
    picker.type = 'color';
    picker.value = currentColor;

    picker.oninput = (e) => {
        STATE.selections[colorId].color = e.target.value;
        dot.style.background = e.target.value;
        STATE.layers = {};
        updatePreview();
    };

    wrap.appendChild(picker);
    return wrap;
}

// ---- Thumbnail strip ----
function buildThumbStrip(partId, partData) {
    const strip = document.createElement('div');
    strip.className = 'thumb-strip';

    partData.options.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'thumb-card' + (STATE.selections[partId]?.style === opt.value ? ' selected' : '');
        card.title = opt.text;

        if (opt.value === 'none') {
            card.classList.add('none-card');
            card.innerHTML = '<i class="fas fa-ban"></i>';
        } else {
            renderThumb(partId, opt.value, card);
        }

        card.onclick = () => {
            strip.querySelectorAll('.thumb-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            STATE.selections[partId].style = opt.value;
            updatePreview();
        };

        strip.appendChild(card);
    });

    return strip;
}

// ============================================================
//  THUMBNAIL RENDERING
// ============================================================
async function renderThumb(partId, value, cardEl) {
    const pathFn = CONFIG.THUMB_PATH[partId];
    if (!pathFn) return;

    const relPath = pathFn(value);
    if (!relPath) return;

    const fullPath = CONFIG.BASE_URL + relPath;
    const cacheKey = fullPath;

    if (STATE.thumbBuffer[cacheKey]) {
        appendThumbCanvas(cardEl, STATE.thumbBuffer[cacheKey]);
        return;
    }

    const img = await loadImage(fullPath);
    if (!img) {
        // Show text fallback
        cardEl.style.fontSize = '0.55rem';
        cardEl.style.color = '#888';
        cardEl.style.padding = '4px';
        cardEl.style.textAlign = 'center';
        cardEl.textContent = value;
        return;
    }

    // Draw to small canvas
    const tc = document.createElement('canvas');
    tc.width = CONFIG.THUMB_SIZE;
    tc.height = CONFIG.THUMB_SIZE;
    const tctx = tc.getContext('2d');

    const scale = Math.min(CONFIG.THUMB_SIZE / img.width, CONFIG.THUMB_SIZE / img.height);
    const dx = (CONFIG.THUMB_SIZE - img.width * scale) / 2;
    const dy = (CONFIG.THUMB_SIZE - img.height * scale) / 2;
    tctx.drawImage(img, dx, dy, img.width * scale, img.height * scale);

    STATE.thumbBuffer[cacheKey] = tc;
    appendThumbCanvas(cardEl, tc);
}

function appendThumbCanvas(cardEl, tc) {
    // Clone so each card has its own element
    const img = document.createElement('img');
    img.src = tc.toDataURL();
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;';
    cardEl.innerHTML = '';
    cardEl.appendChild(img);
}

// ============================================================
//  MAIN PREVIEW RENDERING
// ============================================================
async function updatePreview() {
    const drawOrder = getDrawOrder();

    const layers = await Promise.all(
        drawOrder.map(async (l) => ({
            img: await getLayerImage(l.path, l.color),
            path: l.path
        }))
    );

    const reference = layers.find(l => l.img);
    if (!reference) { return; }

    const assetW = reference.img.width;
    const assetH = reference.img.height;
    const targetDim = UI.canvas.width * 0.78;
    const fitScale = Math.min(targetDim / assetW, targetDim / assetH);

    // Apply user transform on top of auto-fit
    const finalScale = fitScale * STATE.transform.scale;
    const centerX = UI.canvas.width  / 2 + STATE.transform.offsetX;
    const centerY = UI.canvas.height / 2 + STATE.transform.offsetY;

    // Xóa canvas ngay trước khi vẽ để tránh bị nháy
    UI.ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);

    UI.ctx.save();
    UI.ctx.translate(centerX, centerY);
    UI.ctx.rotate(STATE.transform.rotate * Math.PI / 180);
    UI.ctx.scale(finalScale, finalScale);
    // Draw centered on origin
    UI.ctx.translate(-assetW / 2, -assetH / 2);
    layers.forEach(l => { if (l.img) UI.ctx.drawImage(l.img, 0, 0); });
    UI.ctx.restore();
}

function getDrawOrder() {
    const s = STATE.selections;
    const order = [];

    const add = (path, colorKey) => {
        if (!path || path.includes('none') || path.includes('undefined')) return;
        order.push({ path: CONFIG.BASE_URL + path, color: s[colorKey]?.color || null });
    };

    // add với URL override — nếu partId có override thì dùng URL đó
    const addWithOverride = (partId, path, colorKey) => {
        const overrideUrl = STATE.urlOverrides[partId];
        if (overrideUrl) {
            // URL từ API — dùng trực tiếp, không prefix BASE_URL
            order.push({ path: overrideUrl, color: s[colorKey]?.color || null });
        } else {
            add(path, colorKey);
        }
    };

    const hl  = s.hindlegStyleSelect?.style;
    const fl  = s.forelegStyleSelect?.style;
    const w   = s.wingStyle?.style;
    const sn  = s.snoutStyle?.style;
    const eye = s.eyeStyle?.style;
    const brow= s.browStyle?.style;
    const mane= s.maneStyle?.style;
    const horn= s.hornStyle?.style;
    const ear = s.earStyle?.style;
    const fang= s.fangStyle?.style;
    const jaw = s.jawdecStyle?.style;
    const whisker = s.whiskerStyle?.style;
    const belly   = s.bellyStyle?.style;
    const spine   = s.spinedecStyle?.style;

    if (hl && hl !== 'none') {
        add(`legs/hindlegs/hindleg_rear_${hl}_base.png`,  'baseColor');
        add(`legs/markings_hindleg/marking_${hl}_rear_${s.hindlegmarkingStyle?.style}.png`, 'hindlegmarkingColor');
        add(`legs/hindlegs/hindleg_rear_${hl}_bone.png`,  'boneColor');
        add(`legs/hindlegs/hindleg_rear_${hl}_flesh.png`, 'fleshColor');
        add(`legs/hindlegs/hindleg_rear_${hl}_lines.png`, null);
    }
    if (fl && fl !== 'none') {
        add(`legs/forelegs/foreleg_rear_${fl}_base.png`,  'baseColor');
        add(`legs/forelegs/foreleg_rear_${fl}_bone.png`,  'boneColor');
        add(`legs/forelegs/foreleg_rear_${fl}_flesh.png`, 'fleshColor');
        add(`legs/forelegs/foreleg_rear_${fl}_lines.png`, null);
    }
    if (w && w !== 'none') {
        add(`wings/wings/wing_${w}_rear_base.png`,  'baseColor');
        add(`wings/wings/wing_${w}_rear_color.png`, 'wingColor');
        add(`wings/wings/wing_${w}_rear_bone.png`,  'boneColor');
        add(`wings/wings/wing_${w}_rear_lines.png`, null);
    }
    add(`torso/base/newbase_c1.png`, 'baseColor');
    add(`torso/markings/marking_${s.marking1Style?.style}.png`, 'marking1Color');
    add(`torso/markings/marking_${s.marking2Style?.style}.png`, 'marking2Color');
    add(`torso/markings/marking_${s.marking3Style?.style}.png`, 'marking3Color');
    add(`tail/markings_tail/tailmarking_${s.tailmarkingStyle?.style}.png`,  'tailmarkingColor');
    add(`tail/markings_tail/tailmarking_${s.tailmarking2Style?.style}.png`, 'tailmarking2Color');
    add(`torso/base/baselineart.png`, null);
    add(`torso/belly/belly_${belly}_color.png`, 'bellyColor');
    add(`torso/belly/belly_${belly}_lines.png`, null);
    if (sn && sn !== 'none') {
        add(`head/snouts/snout_${sn}_color.png`, 'baseColor');
        add(`head/markings_snout/${sn}_${s.snoutmarkingStyle?.style}.png`, 'snoutmarkingColor');
        add(`head/snouts/snout_${sn}_lines.png`, null);
    }
    add(`head/mouth/mouth_neutral_flesh.png`, 'fleshColor');
    add(`head/mouth/mouth_neutral_bone.png`,  'boneColor');
    add(`head/mouth/mouth_neutral_lines.png`, null);
    add(`head/eyes/eyes_${eye}_color.png`, 'eyeColor');
    add(`head/eyes/eyes_${eye}_lines.png`, null);
    if (brow && brow !== 'none') {
        add(`head/brows/brow_${brow}_color.png`, 'browColor');
        add(`head/brows/brow_${brow}_lines.png`, null);
    }
    if (mane && mane !== 'none') {
        add(`head/manes/mane_${mane}_color.png`, 'maneColor');
        add(`head/manes/mane_${mane}_lines.png`, null);
    }
    if (spine && spine !== 'none') {
        add(`torso/spinedecor/spinedec_${spine}_color.png`, 'spinedecColor');
        add(`torso/spinedecor/spinedec_${spine}_lines.png`, null);
    }
    add(`accessories/acc_tail/${s.tailacc?.style}.png`, null);
    if (hl && hl !== 'none') {
        add(`legs/hindlegs/hindleg_front_${hl}_base.png`,  'baseColor');
        add(`legs/markings_hindleg/marking_${hl}_front_${s.hindlegmarkingStyle?.style}.png`, 'hindlegmarkingColor');
        add(`legs/hindlegs/hindleg_front_${hl}_bone.png`,  'boneColor');
        add(`legs/hindlegs/hindleg_front_${hl}_flesh.png`, 'fleshColor');
        add(`legs/hindlegs/hindleg_front_${hl}_lines.png`, null);
    }
    add(`accessories/acc_torso/${s.torsoacc?.style}.png`, null);
    if (w && w !== 'none') {
        add(`wings/wings/wing_${w}_front_base.png`,  'baseColor');
        add(`wings/wings/wing_${w}_front_color.png`, 'wingColor');
        add(`wings/wings/wing_${w}_front_bone.png`,  'boneColor');
        add(`wings/wings/wing_${w}_front_lines.png`, null);
    }
    if (ear && ear !== 'none') {
        add(`head/ears/ear_${ear}_front_base.png`,  'baseColor');
        add(`head/ears/ear_${ear}_front_flesh.png`, 'fleshColor');
        add(`head/ears/ear_${ear}_front_lines.png`, null);
    }
    if (jaw && jaw !== 'none') {
        add(`head/jawdecor/jawdec_${jaw}_color.png`, 'jawdecColor');
        add(`head/jawdecor/jawdec_${jaw}_lines.png`, null);
    }
    const ht = s.headtopStyle?.style;
    if (ht && ht !== 'none') {
        add(`head/headtop/headtop_${ht}_color.png`, 'headtopColor');
        add(`head/headtop/headtop_${ht}_lines.png`, null);
    }
    if (horn && horn !== 'none') {
        add(`head/horns/horn_${horn}_front_color.png`, 'boneColor');
        add(`head/horns/horn_${horn}_front_lines.png`, null);
    }
    const td1 = s.taildecStyle?.style;
    const td2 = s.taildecStyle2?.style;
    if (td1 && td1 !== 'none') {
        add(`tail/decor/tail_${td1}_color.png`, 'taildecColor');
        add(`tail/decor/tail_${td1}_lines.png`, null);
    }
    if (td2 && td2 !== 'none') {
        add(`tail/decor/tail_${td2}_color.png`, 'taildecColor2');
        add(`tail/decor/tail_${td2}_lines.png`, null);
    }
    if (fl && fl !== 'none') {
        add(`legs/forelegs/foreleg_front_${fl}_base.png`,  'baseColor');
        add(`legs/markings_foreleg/marking_${fl}_front_${s.forelegmarkingStyle?.style}.png`, 'forelegmarkingColor');
        add(`legs/forelegs/foreleg_front_${fl}_bone.png`,  'boneColor');
        add(`legs/forelegs/foreleg_front_${fl}_flesh.png`, 'fleshColor');
        add(`legs/forelegs/foreleg_front_${fl}_lines.png`, null);
    }
    add(`accessories/acc_neck/${s.neckacc?.style}.png`, null);
    add(`accessories/acc_head/${s.headacc?.style}.png`, null);
    if (whisker && whisker !== 'none') {
        add(`head/whiskers/whisker_front_${whisker}.png`, 'whiskerColor');
    }
    const breath = s.breath?.style;
    if (breath && breath !== 'none') {
        addWithOverride('breath', `breath/breath_${breath}.png`, 'breathColor');
    }

    return order;
}

// ============================================================
//  IMAGE HELPERS
// ============================================================
async function getLayerImage(path, color) {
    const key = `${path}_${color || 'none'}`;
    if (STATE.layers[key]) return STATE.layers[key];

    const img = await loadImage(path);
    if (!img) return null;

    if (!color || color === '#FFFFFF' || color === '#ffffff') {
        STATE.layers[key] = img;
        return img;
    }

    const colored = recolorImage(img, color);
    STATE.layers[key] = colored;
    return colored;
}

function loadImage(src) {
    if (STATE.imageBuffer[src]) return Promise.resolve(STATE.imageBuffer[src]);
    return new Promise(resolve => {
        const img = new Image();
        // Chỉ set crossOrigin cho URL bên ngoài (http/https)
        // File local (file://) không cần và sẽ bị lỗi nếu set
        if (src.startsWith('http://') || src.startsWith('https://')) {
            img.crossOrigin = 'anonymous';
        }
        img.onload  = () => { STATE.imageBuffer[src] = img; resolve(img); };
        img.onerror = () => {
            console.warn('[loadImage] Failed:', src);
            resolve(null);
        };
        img.src = src;
    });
}

function recolorImage(img, color) {
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d');
    
    // Đổ màu nền
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, c.width, c.height);

    // Blend multiply ảnh gốc đè lên (để giữ khối và shading)
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(img, 0, 0);

    // Giữ lại phần alpha của ảnh gốc (xóa các vùng trong suốt)
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(img, 0, 0);
    
    return c;
}

// ============================================================
//  RANDOMIZE
// ============================================================
function randomizeTraits() {
    for (let id in STATE.data.selects) {
        const opts = STATE.data.selects[id].options;
        STATE.selections[id].style = opts[Math.floor(Math.random() * opts.length)].value;
    }
    STATE.layers = {};
    renderPanel();
    updatePreview();
}

function randomizeColors() {
    STATE.data.color_inputs.forEach(ci => {
        STATE.selections[ci.id].color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    });
    STATE.layers = {};
    renderPanel();
    updatePreview();
}

function randomizeAll() {
    randomizeTraits();
    randomizeColors();
}

// ============================================================
//  DOWNLOAD
// ============================================================
function downloadPNG() {
    // If running inside Android WebView, use native bridge
    if (window.AndroidBridge) {
        const dataUrl = UI.canvas.toDataURL('image/png');
        AndroidBridge.onEvent(JSON.stringify({
            type: 'DOWNLOAD_READY',
            data: dataUrl
        }));
        return;
    }
    // Fallback: browser download
    const link = document.createElement('a');
    link.download = 'my-dragon.png';
    link.href = UI.canvas.toDataURL('image/png');
    link.click();
}

// ============================================================
//  ANDROID BRIDGE — dispatch(actionJson)
//  Kotlin gọi: window.dispatch('{"type":"SET_STYLE",...}')
// ============================================================
window.dispatch = function(actionJson) {
    let action;
    try {
        action = (typeof actionJson === 'string') ? JSON.parse(actionJson) : actionJson;
    } catch (e) {
        console.error('[dispatch] Invalid JSON:', actionJson);
        return;
    }

    switch (action.type) {

        // Đổi style bộ phận: { type, partId, value }
        case 'SET_STYLE': {
            const sel = STATE.selections[action.partId];
            if (!sel) { console.warn('[dispatch] Unknown partId:', action.partId); return; }
            sel.style = action.value;
            STATE.layers = {};
            updatePreview();
            break;
        }

        // Đổi màu: { type, colorId, hex }
        case 'SET_COLOR': {
            const sel = STATE.selections[action.colorId];
            if (!sel) { console.warn('[dispatch] Unknown colorId:', action.colorId); return; }
            sel.color = action.hex;
            STATE.layers = {};
            updatePreview();
            break;
        }

        // Override 1 layer bằng URL từ API/Kotlin
        // { type: "SET_LAYER", partId: "breath", url: "https://api.example.com/fire.png" }
        // Để xóa override: { type: "SET_LAYER", partId: "breath", url: "" }
        case 'SET_LAYER': {
            const { partId, url } = action;
            if (!partId) { console.warn('[dispatch] SET_LAYER missing partId'); return; }
            if (url && url.length > 0) {
                STATE.urlOverrides[partId] = url;
            } else {
                // url rỗng = xóa override, dùng lại file local
                delete STATE.urlOverrides[partId];
            }
            // Xóa cache của layer này
            Object.keys(STATE.layers).forEach(k => {
                if (k.includes(url) || k.includes(partId)) delete STATE.layers[k];
            });
            delete STATE.imageBuffer[url];
            updatePreview();
            break;
        }

        // Override nhiều layer cùng lúc từ API response
        // { type: "SET_LAYERS_BATCH", layers: { "breath": "https://...", "eyeStyle": "https://..." } }
        case 'SET_LAYERS_BATCH': {
            const { layers } = action;
            if (!layers) { console.warn('[dispatch] SET_LAYERS_BATCH missing layers'); return; }
            Object.entries(layers).forEach(([partId, url]) => {
                if (url && url.length > 0) {
                    STATE.urlOverrides[partId] = url;
                } else {
                    delete STATE.urlOverrides[partId];
                }
            });
            STATE.layers = {};      // clear toàn bộ layer cache
            STATE.imageBuffer = {}; // clear image cache để load lại từ URL mới
            updatePreview();
            break;
        }

        // Random traits only
        case 'RANDOMIZE_TRAITS':
            randomizeTraits();
            break;

        // Random colors only
        case 'RANDOMIZE_COLORS':
            randomizeColors();
            break;

        // Random everything
        case 'RANDOMIZE_ALL':
            randomizeAll();
            break;

        // Download / share
        case 'DOWNLOAD':
            downloadPNG();
            break;

        // Switch active tab: { type, tab }
        case 'SET_TAB': {
            const btn = document.querySelector(`.btab[data-tab="${action.tab}"]`);
            if (btn) {
                btn.click();
            }
            break;
        }

        // Reset to defaults
        case 'RESET':
            setupDefaultSelections();
            STATE.layers = {};
            renderPanel();
            updatePreview();
            break;

        // Reset chỉ transform (vị trí/góc/size)
        case 'RESET_TRANSFORM':
            STATE.transform = { offsetX: 0, offsetY: 0, rotate: 0, scale: 1.0 };
            updatePreview();
            break;

        // Di chuyển / xoay / scale rồng trên canvas
        // { type: "SET_TRANSFORM", offsetX, offsetY, rotate, scale }
        // Chỉ cần gửi các field muốn thay đổi, các field khác giữ nguyên
        case 'SET_TRANSFORM': {
            const t = STATE.transform;
            if (action.offsetX !== undefined) t.offsetX = parseFloat(action.offsetX);
            if (action.offsetY !== undefined) t.offsetY = parseFloat(action.offsetY);
            if (action.rotate  !== undefined) t.rotate  = parseFloat(action.rotate);
            if (action.scale   !== undefined) t.scale   = parseFloat(action.scale);
            updatePreview();
            break;
        }

        // Di chuyển tương đối (cộng thêm vào giá trị hiện tại)
        // { type: "MOVE", dx, dy }
        case 'MOVE': {
            STATE.transform.offsetX += parseFloat(action.dx || 0);
            STATE.transform.offsetY += parseFloat(action.dy || 0);
            updatePreview();
            break;
        }

        // Xoay tương đối
        // { type: "ROTATE", deg }
        case 'ROTATE': {
            STATE.transform.rotate += parseFloat(action.deg || 0);
            updatePreview();
            break;
        }

        // Scale tương đối
        // { type: "SCALE", factor } — ví dụ 1.1 để zoom in 10%
        case 'SCALE': {
            const newScale = STATE.transform.scale * parseFloat(action.factor || 1);
            STATE.transform.scale = Math.max(0.1, Math.min(5.0, newScale));
            updatePreview();
            break;
        }

        // Get full state JSON — result returned via callback
        // Kotlin: webView.evaluateJavascript("window.dispatch({type:'GET_STATE'})", { result -> })
        case 'GET_STATE':
            return JSON.stringify(STATE.selections);

        default:
            console.warn('[dispatch] Unknown action type:', action.type);
    }
};

// ============================================================
//  START
// ============================================================
init();
