// Gift site v4 (cute + pink + emoji festival decor)
const $ = (sel) => document.querySelector(sel);

const openBtn = $("#openBtn");
const overlay = $("#overlay");
const progress = $("#progress");
const content = $("#content");
const headline = $("#headline");
const subline = $("#subline");
const overlayTitle = $("#overlayTitle");
const copyBtn = $("#copyBtn");
const copyToast = $("#copyToast");
const skipBtn = $("#skipBtn");
const musicBtn = $("#musicBtn");
const bgm = $("#bgm");

const intro = $("#intro");
const enterBtn = $("#enterBtn");


const STORAGE_KEY = "gift_site_v4";
const state = loadState();

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; }
  catch { return {}; }
}
function saveState(next){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function daySeed(){
  const d = new Date();
  return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
}
function mulberry32(a){
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}


/** Intro curtain (daily first visit) */
const INTRO_KEY = "gift_intro_seen_day";

function initIntroCurtain(){
  if(!intro || !enterBtn) return;

  const today = String(daySeed());
  const seen = localStorage.getItem(INTRO_KEY);

  if(seen === today){
    // already seen today
    intro.classList.add("hidden");
    return;
  }

  intro.classList.remove("hidden");
  document.body.classList.add("introLock");

  const closeIntro = () => {
    // mark seen first, so even if animations are interrupted it won't loop
    localStorage.setItem(INTRO_KEY, today);
    intro.classList.add("open");
    // hide after animation
    setTimeout(() => {
      intro.classList.add("hidden");
      intro.classList.remove("open");
      document.body.classList.remove("introLock");
    }, 900);
  };

  enterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeIntro();
  });

  // allow clicking the dim background to enter
  intro.addEventListener("click", (e) => {
    if(e.target === intro) closeIntro();
  });

  // escape to enter
  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && !intro.classList.contains("hidden")){
      closeIntro();
    }
  }, { once:false });
}


/** Daily content */
const palette = [
  { name:"粉粉", hex:"#ffb6c9", why:["今天就用溫柔一點的顏色。","今天先對自己好一點。","今天抱抱自己一下。"]},
  { name:"草莓牛奶", hex:"#ff77a8", why:["今天可愛就夠了。","先笑一下，再做事。","今天不用逞強。"]},
  { name:"棉花糖", hex:"#ffe4ec", why:["今天適合放輕鬆。","慢慢來也很棒。","今天先休息一下。"]},
  { name:"玫瑰粉", hex:"#ff5f95", why:["今天走你的節奏。","今天先選擇開心。","今天就是漂亮的一天。"]},
];

const dailyLines = [
  "今天也想讓你開心一點。",
  "你很棒，真的。",
  "今天先對自己溫柔一點。",
  "你不用很完美也很可愛。",
  "今天我站你這邊。",
  "你笑一下我就滿足了。"
];

const microActions = [
  { title:"喝一杯水", why:"先把狀態拉回來。" },
  { title:"看遠方 20 秒", why:"眼睛休息一下。" },
  { title:"去吃點喜歡的", why:"你值得被照顧。" },
  { title:"把一件小事做完", why:"完成感會讓你更穩。" },
];

function pickDaily(){
  const rng = mulberry32(daySeed());
  const p = palette[Math.floor(rng() * palette.length)];
  const why = p.why[Math.floor(rng() * p.why.length)];
  const line = dailyLines[Math.floor(rng() * dailyLines.length)];
  const action = microActions[Math.floor(rng() * microActions.length)];
  return { p, why, line, action };
}


const luckPackNames = [
  "粉粉運氣包",
  "小小幸運包",
  "今天剛剛好的包",
  "溫柔一點點包",
  "給你的小偏心包",
  "今天不錯包",
  "偷偷加分包",
];

function getTodayLuckPackName(){
  const idx = daySeed() % luckPackNames.length;
  return luckPackNames[idx];
}



function renderDaily(){
  const { p, why, line, action } = pickDaily();
  const packName = getTodayLuckPackName();
  const packTag = document.getElementById("packTag");
  if(packTag) packTag.textContent = `今日運氣包 · ${packName}`;
  $("#colorSwatch").style.background = p.hex;
  $("#colorName").textContent = p.name;
  $("#colorWhy").textContent = why;

  $("#dailyLine").textContent = line;
  const d = new Date();
  $("#quoteMeta").textContent =
    `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;

  $("#microAction").textContent = action.title;
  $("#microWhy").textContent = action.why;
}

/** Overlay (never stuck) */
function revealContent(){
  overlay.classList.add("hidden");
  content.classList.remove("hidden");
  content.scrollIntoView({ behavior:"smooth", block:"start" });
}

function showOverlayThenReveal(){
  overlay.classList.remove("hidden");
  content.classList.add("hidden");
  overlayTitle.textContent = "開箱中…";
  progress.style.width = "0%";

  const total = 2100;
  const start = Date.now();

  const timer = setInterval(() => {
    const t = Math.min(1, (Date.now() - start) / total);
    progress.style.width = `${Math.floor(t*100)}%`;
    if(t >= 1){
      clearInterval(timer);
      overlayTitle.textContent = "完成 ✅";
    }
  }, 16);

  setTimeout(() => {
    clearInterval(timer);
    revealContent();
  }, 2600);
}

/** Emoji festival decorations (no downloads needed) */
const FESTIVALS = [
  { name:"christmas", start:"12-18", end:"12-31", emojis:["❄️","✨","🎀","🎄"] },
  { name:"newyear",   start:"01-01", end:"01-14", emojis:["🧨","🏮","✨","🧧"] },
  { name:"midautumn", start:"09-10", end:"09-24", emojis:["🌕","🐰","✨"] },
  { name:"dragonboat",start:"06-01", end:"06-14", emojis:["🍙","🐉","🚣"] },
];

function mmdd(date){
  return `${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function isInRange(today, start, end){
  return start <= end ? (today >= start && today <= end) : (today >= start || today <= end);
}
function loadFestivalDecorations(){
  const today = mmdd(new Date());
  const fest = FESTIVALS.find(f => isInRange(today, f.start, f.end));
  if(!fest) return;

  const positions = [
    { left:"6%",  top:"12%" },
    { left:"90%", top:"14%" },
    { left:"8%",  top:"76%" },
    { left:"88%", top:"78%" },
    { left:"50%", top:"8%"  },
  ];

  fest.emojis.forEach((emoji, i) => {
    const el = document.createElement("div");
    el.className = "festival-emoji";
    el.textContent = emoji;
    el.style.left = positions[i % positions.length].left;
    el.style.top  = positions[i % positions.length].top;
    el.style.animationDelay = (i * 0.7) + "s";
    document.body.appendChild(el);
  });
}

/** Events */
openBtn.addEventListener("click", () => {
  try{
    renderDaily();
    showOverlayThenReveal();
  }catch(e){
    console.error(e);
    revealContent();
  }
});


copyBtn.addEventListener("click", async () => {
  const code = "我開箱了";
  try{
    await navigator.clipboard.writeText(code);
    copyToast.classList.add("show");
    setTimeout(() => copyToast.classList.remove("show"), 1200);
  }catch(e){
    alert("複製失敗。暗號是：我開箱了");
  }
});

skipBtn.addEventListener("click", revealContent);

// Optional music toggle (only works if you later add an mp3 to <audio>)
musicBtn.addEventListener("click", async () => {
  const isOn = state.musicOn === true;
  const next = !isOn;
  state.musicOn = next;
  saveState(state);
  musicBtn.textContent = next ? "音樂：開" : "音樂：關";
  musicBtn.setAttribute("aria-pressed", String(next));

  try{
    if(next){
      await bgm.play();
    }else{
      bgm.pause();
    }
  }catch(e){
    // autoplay might be blocked if no user gesture or no src
  }
});

// Boot
loadFestivalDecorations();
initIntroCurtain();
musicBtn.textContent = (state.musicOn ? "音樂：開" : "音樂：關");
musicBtn.setAttribute("aria-pressed", String(!!state.musicOn));


/** ===== V6 Cat peek modal + extra sparkles ===== */
(function(){
  const catPeekBtn = document.getElementById("catPeekBtn");
  const catModal = document.getElementById("catModal");
  const catCloseBtn = document.getElementById("catCloseBtn");

  function openCat(){
    if(!catModal) return;
    catModal.classList.remove("hidden");
  }
  function closeCat(){
    if(!catModal) return;
    catModal.classList.add("hidden");
  }

  if(catPeekBtn) catPeekBtn.addEventListener("click", openCat);
  if(catCloseBtn) catCloseBtn.addEventListener("click", closeCat);
  if(catModal){
    catModal.addEventListener("click", (e) => {
      if(e.target === catModal) closeCat();
    });
    window.addEventListener("keydown", (e) => {
      if(e.key === "Escape") closeCat();
    });
  }

  // sparkles (lightweight, non-intrusive)
  const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(prefersReduce) return;

  const N = 10;
  const spots = [];
  for(let i=0;i<N;i++){
    const s = document.createElement("div");
    s.className = "sparkle";
    const left = Math.random()*100;
    const top = 18 + Math.random()*70; // avoid header
    s.style.left = left + "vw";
    s.style.top = top + "vh";
    s.style.animationDelay = (Math.random()*3) + "s";
    s.style.transform = `translateY(${Math.random()*8}px) scale(${0.9 + Math.random()*0.5})`;
    document.body.appendChild(s);
    spots.push(s);
  }
  // gently reposition occasionally to keep it alive
  setInterval(() => {
    spots.forEach(s => {
      if(Math.random() < .45){
        s.style.left = (Math.random()*100) + "vw";
        s.style.top = (18 + Math.random()*70) + "vh";
      }
    });
  }, 6500);
})();



/* ===== V7 Astrology Overlay (soft, never negative) ===== */
(function(){
  const BIRTH = 20071118; // fixed birthdate
  function todaySeed(){
    const d = new Date();
    return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
  }
  function hash(n){
    let x = n % 2147483647;
    return () => (x = x * 16807 % 2147483647) / 2147483647;
  }
  const rng = hash(todaySeed() + BIRTH);

  const fortunes = [
    {level:"吉", text:"今天的氣場對你是溫柔的。"},
    {level:"小吉", text:"今天適合慢慢來，事情會順。"},
    {level:"平", text:"今天不用勉強自己，照顧好感受就好。"}
  ];

  const picks = fortunes[Math.floor(rng()*fortunes.length)];

  const el = document.getElementById("dailyLine");
  if(el){
    el.textContent = `【${picks.level}】 ${picks.text}`;
  }
})();



/* ===== V7.1 Lucky color follows astrology seed ===== */
(function(){
  const BIRTH = 20071118;
  function todaySeed(){
    const d = new Date();
    return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
  }
  function hash(n){
    let x = n % 2147483647;
    return () => (x = x * 16807 % 2147483647) / 2147483647;
  }
  const rng = hash(todaySeed() + BIRTH);

  const palette = [
    { name:"柔霧粉", hex:"#ffd6e5", why:"今天適合溫柔一點。"},
    { name:"奶油白", hex:"#fff7ef", why:"讓心慢下來。"},
    { name:"草芽綠", hex:"#dff3e3", why:"今天有被照顧的感覺。"},
    { name:"淡薰紫", hex:"#ece6ff", why:"適合靜靜想事情。"},
    { name:"晴空藍", hex:"#e6f1ff", why:"心會比較輕。"},
  ];

  const p = palette[Math.floor(rng()*palette.length)];
  const sw = document.getElementById("colorSwatch");
  const cn = document.getElementById("colorName");
  const cw = document.getElementById("colorWhy");
  if(sw && cn && cw){
    sw.style.background = p.hex;
    cn.textContent = p.name;
    cw.textContent = p.why;
  }
})();
function msUntilNextMidnight(timeZone) {
  const now = new Date();
  // 用本地時區就不傳 timeZone；要固定時區才傳
  const local = timeZone ? new Date(new Intl.DateTimeFormat("en-US", { timeZone }).format(now)) : now;

  const next = new Date(local);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - local.getTime();
}

function scheduleMidnightReload({ timeZone } = {}) {
  const wait = msUntilNextMidnight(timeZone);
  setTimeout(() => {
    location.reload();
  }, wait + 50); // +50ms 避免邊界誤差
}

// 初始化完成後呼叫（本地時間）：
scheduleMidnightReload();
// 若你要“固定用台灣時間”
// scheduleMidnightReload({ timeZone: "Asia/Taipei" });



/* ===== V7.2 Force astrology color AFTER render ===== */
(function(){
  const BIRTH = 20071118;
  function seed(){
    const d = new Date();
    return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate() + BIRTH;
  }
  function hash(n){
    let x = n % 2147483647;
    return () => (x = x * 16807 % 2147483647) / 2147483647;
  }
  const palette = [
    { name:"柔霧粉", hex:"#ffd6e5", why:"今天適合溫柔一點。" },
    { name:"奶油白", hex:"#fff7ef", why:"讓心慢下來。" },
    { name:"草芽綠", hex:"#dff3e3", why:"今天有被照顧的感覺。" },
    { name:"淡薰紫", hex:"#ece6ff", why:"適合靜靜想事情。" },
    { name:"晴空藍", hex:"#e6f1ff", why:"心會比較輕。" }
  ];

  function applyColor(){
    const rng = hash(seed());
    const p = palette[Math.floor(rng()*palette.length)];
    const sw = document.getElementById("colorSwatch");
    const cn = document.getElementById("colorName");
    const cw = document.getElementById("colorWhy");
    if(sw && cn && cw){
      sw.style.background = p.hex;
      cn.textContent = p.name;
      cw.textContent = p.why;
    }
  }

  // run after any existing render
  window.addEventListener("load", () => {
    setTimeout(applyColor, 50);
  });
  document.addEventListener("click", (e)=>{
    if(e.target && e.target.id === "openBtn"){
      setTimeout(applyColor, 200);
    }
  });
})();
