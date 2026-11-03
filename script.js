// =====================================================================
//  Wander Wisdom – interactions
// =====================================================================

// ---------- Settings you can change ----------
// Paste your checkout link here once you have one (Stripe Payment Link,
// Shopify, Etsy, PayPal …). While it's empty, the order button shows a
// note that asks people to order via Instagram.
const CHECKOUT_URL = "";

// The 20 prompts from the back of the book.
const PROMPTS = [
  "What life lesson took you the longest to learn?",
  "What is one piece of wisdom you wish everyone knew?",
  "When faced with a challenge, what mindset or belief has helped you the most?",
  "Looking back, what decision in your life brought the most unexpected growth?",
  "What is something you believe that most people wouldn't expect?",
  "What does true happiness look like to you?",
  "What's the most valuable lesson you've learned from failure?",
  "What advice would you give someone looking to find purpose in their life?",
  "What's the goal in your life that you barely told anyone?",
  "What does it mean to live a meaningful life, in your own words?",
  "What's the most important thing you've learned about relationships?",
  "When do you feel most at peace with yourself?",
  "What's the most valuable lesson you've learned from someone unexpected?",
  "How do you stay true to yourself in difficult situations?",
  "What's one decision you made that completely changed your life?",
  "What's one belief or habit that has made a significant difference in your life?",
  "If you could teach the world one thing, what would it be?",
  "How do you find meaning in everyday life?",
  "What's the biggest risk you've taken, and what did it teach you?",
  "What do you wish people understood about the journey of growth?",
];

(() => {
  const MAP = window.WW_MAP;
  const ENTRIES = window.WW_ENTRIES || [];
  const $ = (s) => document.querySelector(s);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPhone = () => window.innerWidth <= 720;

  // Same plain lat/lon projection as tools/build-map.mjs
  const project = (lat, lon) => [((lon + 180) / 360) * MAP.w, ((MAP.latTop - lat) / 360) * MAP.w];
  const unproject = (x, y) => [MAP.latTop - (y / MAP.w) * 360, (x / MAP.w) * 360 - 180];

  $("#heroLand").setAttribute("d", MAP.d);
  $("#orderLand").setAttribute("d", MAP.d);

  // ===================================================================
  //  HERO MAP
  // ===================================================================
  const hero = $(".hero");
  const svg = $("#heroMap");
  const markerLayer = $("#markers");
  const pts = ENTRIES.map((e) => project(e.lat, e.lon));
  const DOT_COLOURS = ["#ff5a1f", "#1f3ddb", "#ff4f8b", "#f2a900", "#11a07a"]; // one ink per person
  const n = ENTRIES.length;

  // Journey line: gentle arcs from person to person
  let routeD = "";
  const segLengths = [];
  pts.forEach(([x, y], i) => {
    if (i === 0) { routeD = `M${x} ${y}`; return; }
    const [x0, y0] = pts[i - 1];
    const dx = x - x0, dy = y - y0, dist = Math.hypot(dx, dy);
    let nx = -dy / dist, ny = dx / dist;
    if (ny > 0) { nx = -nx; ny = -ny; } // always bow upwards
    const cx = (x0 + x) / 2 + nx * dist * 0.22, cy = (y0 + y) / 2 + ny * dist * 0.22;
    routeD += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x} ${y}`;
    segLengths.push(dist);
  });
  $("#route").setAttribute("d", routeD);
  const routeMask = $("#routeMask");
  routeMask.setAttribute("d", routeD);

  // Markers (real buttons, so they work with keyboard and screen readers)
  const markers = ENTRIES.map((e, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "marker";
    b.setAttribute("aria-label", `${e.name} in ${e.place}${e.example ? " (example entry)" : ""}`);
    const label = document.createElement("span");
    label.className = "marker-label";
    label.setAttribute("aria-hidden", "true");
    label.textContent = `${e.name}, ${e.place.split(",")[0]}`;
    b.append(label);
    b.addEventListener("click", () => show(i));
    b.style.setProperty("--c", DOT_COLOURS[i % DOT_COLOURS.length]);
    markerLayer.append(b);
    return b;
  });

  // ---------- Camera ----------
  // The SVG viewBox is the camera: x/y = top-left corner in map units, w = width in map units.
  let cam = { x: 0, y: 0, w: MAP.w };
  let anim = null;
  const view = () => [hero.clientWidth, hero.clientHeight];

  function apply() {
    const [vw, vh] = view();
    const h = (cam.w * vh) / vw;
    svg.setAttribute("viewBox", `${cam.x.toFixed(2)} ${cam.y.toFixed(2)} ${cam.w.toFixed(2)} ${h.toFixed(2)}`);
    const k = vw / cam.w;
    markers.forEach((m, i) => {
      m.style.transform = `translate(${((pts[i][0] - cam.x) * k).toFixed(1)}px, ${((pts[i][1] - cam.y) * k).toFixed(1)}px)`;
    });
  }

  // Camera that puts map point (px, py) at screen point (sx, sy) with scale k (pixels per map unit)
  function camAt(px, py, k, sx, sy) {
    const [vw] = view();
    return { x: px - sx / k, y: py - sy / k, w: vw / k };
  }

  function overviewCam() {
    const [vw, vh] = view();
    const k = Math.max(vw / (MAP.w * 1.04), ((isPhone() ? 0.44 : 0.4) * vh) / MAP.h);
    const xs = pts.map((p) => p[0]);
    const half = vw / k / 2;
    let cx = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : MAP.w / 2;
    cx = Math.min(Math.max(cx, half), MAP.w - half);
    if (half * 2 >= MAP.w) cx = MAP.w / 2;
    return camAt(cx, MAP.h / 2, k, vw / 2, vh * (isPhone() ? 0.27 : 0.42));
  }

  function focusCam(i) {
    const [vw, vh] = view();
    const [px, py] = pts[i];
    if (isPhone()) return camAt(px, py, vw / 230, vw / 2, vh * 0.2);
    const card = Math.min(410, vw * 0.42) + Math.min(80, vw * 0.05) + 40;
    const free = vw - card;
    return camAt(px, py, free / 320, free / 2, vh / 2);
  }

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function flyTo(target) {
    cancelAnimationFrame(anim);
    if (reduceMotion) { cam = target; apply(); return; }
    const [vw, vh] = view();
    const from = { ...cam };
    const c0 = [from.x + from.w / 2, from.y + (from.w * vh) / vw / 2];
    const c1 = [target.x + target.w / 2, target.y + (target.w * vh) / vw / 2];
    const dist = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]);
    // zoom out a little in the middle of long trips, like a plane taking off
    const bump = Math.min(dist / Math.max(from.w, target.w), 2.5) * 0.45;
    const dur = 900 + Math.min(dist, 600) * 1.1;
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min((now - t0) / dur, 1), e = ease(t);
      const w = Math.exp(Math.log(from.w) + (Math.log(target.w) - Math.log(from.w)) * e) * (1 + bump * Math.sin(Math.PI * e));
      const cx = c0[0] + (c1[0] - c0[0]) * e, cy = c0[1] + (c1[1] - c0[1]) * e;
      cam = { x: cx - w / 2, y: cy - (w * vh) / vw / 2, w };
      apply();
      if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  // ---------- The journal page ----------
  const card = $("#entry");
  const page = $("#entryPage");
  let current = -1;

  function show(i) {
    if (!n) return;
    const firstOpen = card.hidden;
    current = (i + n) % n;
    const e = ENTRIES[current];

    page.className = `page hand-${e.hand || "caveat"}`;
    $("#entryStamp").hidden = !e.example;
    $("#entryPlace").textContent = e.date ? `${e.place}, ${e.date}` : e.place;
    $("#entryQuestion").textContent = e.question;
    $("#entryAnswer").textContent = e.answer;
    $("#entryName").textContent = e.name;
    $("#entryHome").textContent = e.hometown;
    $("#entryCount").textContent = `${current + 1} of ${n}`;
    markers.forEach((m, j) => m.setAttribute("aria-current", j === current ? "true" : "false"));

    card.hidden = false;
    if (firstOpen) {
      card.classList.remove("is-open"); void card.offsetWidth; card.classList.add("is-open");
    } else {
      page.classList.remove("is-turning"); void page.offsetWidth; page.classList.add("is-turning");
    }
    page.scrollTop = 0;
    hero.classList.add("is-reading");
    flyTo(focusCam(current));
  }

  function close() {
    if (card.hidden) return;
    card.hidden = true;
    hero.classList.remove("is-reading");
    markers.forEach((m) => m.setAttribute("aria-current", "false"));
    flyTo(overviewCam());
    if (markers[current]) markers[current].focus({ preventScroll: true });
    current = -1;
  }

  $("#entryNext").addEventListener("click", () => show(current + 1));
  $("#entryPrev").addEventListener("click", () => show(current - 1));
  $("#entryClose").addEventListener("click", close);
  $("#startJourney").addEventListener("click", () => { show(0); $("#entryNext").focus({ preventScroll: true }); });

  document.addEventListener("keydown", (ev) => {
    if (card.hidden) return;
    if (ev.key === "Escape") close();
    else if (ev.key === "ArrowRight") show(current + 1);
    else if (ev.key === "ArrowLeft") show(current - 1);
  });

  // swipe the page sideways on phones
  let touchX = null;
  page.addEventListener("touchstart", (ev) => { touchX = ev.touches[0].clientX; }, { passive: true });
  page.addEventListener("touchend", (ev) => {
    if (touchX === null) return;
    const dx = ev.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // close the page when scrolling away from the map
  new IntersectionObserver(([en]) => { if (!en.isIntersecting) close(); }, { threshold: 0.15 }).observe(hero);

  // ---------- First load: draw the journey, light up each person ----------
  cam = overviewCam();
  apply();
  const total = segLengths.reduce((a, b) => a + b, 0) || 1;
  const DRAW = reduceMotion ? 0 : 2600;
  let acc = 0;
  markers.forEach((m, i) => {
    if (i > 0) acc += segLengths[i - 1];
    m.style.setProperty("--delay", `${(300 + (acc / total) * DRAW) / 1000}s`);
  });
  const len = routeMask.getTotalLength();
  routeMask.style.strokeDasharray = `${len} ${len}`;
  routeMask.style.strokeDashoffset = reduceMotion ? 0 : len;
  const startHero = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    if (!reduceMotion) {
      routeMask.style.transition = `stroke-dashoffset ${DRAW}ms cubic-bezier(.45,.05,.35,1) 300ms`;
      routeMask.style.strokeDashoffset = 0;
    }
    hero.classList.add("is-ready");
  }));

  // ---------- Intro: the book opens, then the map starts drawing ----------
  const intro = $("#intro");
  if (document.documentElement.classList.contains("intro")) {
    const timers = [];
    let heroStarted = false;
    const beginHero = () => { if (!heroStarted) { heroStarted = true; startHero(); } };
    const finish = () => {
      timers.forEach(clearTimeout);
      document.documentElement.classList.remove("intro");
      intro.remove();
      beginHero();
    };
    timers.push(setTimeout(() => intro.classList.add("is-open"), 1000));
    timers.push(setTimeout(() => { intro.classList.add("is-leaving"); beginHero(); }, 2900));
    timers.push(setTimeout(finish, 3900));
    $("#introSkip").addEventListener("click", finish);
    document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && intro.isConnected) finish(); });
  } else {
    intro.remove();
    startHero();
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(anim);
      cam = current >= 0 ? focusCam(current) : overviewCam();
      apply();
      placeOrderDot();
    }, 120);
  });

  // ===================================================================
  //  ORDER: the empty map
  // ===================================================================
  const orderWrap = $(".order-map-wrap");
  const orderSvg = $("#orderMap");
  const orderLayer = $("#orderMarkers");
  const hint = $("#orderHint");
  orderSvg.setAttribute("viewBox", `0 0 ${MAP.w} ${MAP.h}`);
  orderSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  let orderPoint = null;
  let orderDot = null;

  function placeOrderDot() {
    if (!orderPoint || !orderDot) return;
    const p = orderSvg.createSVGPoint();
    [p.x, p.y] = orderPoint;
    const s = p.matrixTransform(orderSvg.getScreenCTM());
    const r = orderWrap.getBoundingClientRect();
    orderDot.style.transform = `translate(${s.x - r.left}px, ${s.y - r.top}px)`;
  }

  orderWrap.addEventListener("click", (ev) => {
    const p = orderSvg.createSVGPoint();
    p.x = ev.clientX; p.y = ev.clientY;
    const m = p.matrixTransform(orderSvg.getScreenCTM().inverse());
    orderPoint = [m.x, m.y];
    if (!orderDot) {
      orderDot = document.createElement("span");
      orderDot.className = "marker";
      orderDot.innerHTML = '<span class="marker-label">Your first wisdom</span>';
      orderLayer.append(orderDot);
    }
    placeOrderDot();
    const [lat, lon] = unproject(m.x, m.y);
    const fmt = (v, pos, neg) => `${Math.abs(Math.round(v))}° ${v >= 0 ? pos : neg}`;
    hint.textContent = `${fmt(lat, "N", "S")}, ${fmt(lon, "E", "W")}. Someone there has something to tell you.`;
  });

  // ===================================================================
  //  TOP BAR: dark or light text depending on the section underneath
  // ===================================================================
  const bar = $(".bar");
  const toned = [...document.querySelectorAll("[data-tone]")];
  let toneTick = false;
  const updateTone = () => {
    toneTick = false;
    const y = bar.offsetHeight / 2;
    const under = toned.find((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    bar.dataset.tone = under ? under.dataset.tone : "light";
  };
  window.addEventListener("scroll", () => { if (!toneTick) { toneTick = true; requestAnimationFrame(updateTone); } }, { passive: true });
  updateTone();

  // ===================================================================
  //  PROMPTS + ORDER BUTTON
  // ===================================================================
  const promptText = $("#promptText");
  let promptIndex = 12;
  $("#promptNext").addEventListener("click", () => {
    let next;
    do { next = Math.floor(Math.random() * PROMPTS.length); } while (next === promptIndex);
    promptIndex = next;
    promptText.textContent = PROMPTS[next];
  });

  const orderBtn = $("#orderBtn");
  if (CHECKOUT_URL) orderBtn.href = CHECKOUT_URL;
  orderBtn.addEventListener("click", (ev) => {
    if (CHECKOUT_URL) return;
    ev.preventDefault();
    $("#orderNotice").hidden = false;
  });
})();
