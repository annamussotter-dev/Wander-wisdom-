/* Wander Wisdom — map of wisdom
 *
 * EXAMPLE entries below. Replace them with real answers from the journal
 * (with each person's permission), then set `example: false`.
 *
 * x / y are positions on the 1000 x 500 map. To add a new place, see README.md.
 */
const PEOPLE = [
  {
    example: true,
    place: "Lisbon, Portugal", date: "March 2024", x: 478.3, y: 134.7,
    question: "Life is about…",
    answer: "Saying yes to the conversation you almost didn’t start.",
    name: "Marta", hometown: "Porto",
  },
  {
    example: true,
    place: "Chiang Mai, Thailand", date: "May 2024", x: 749.6, y: 194.2,
    question: "What did travelling teach you?",
    answer: "That home is not a place. It’s the people who make you feel seen.",
    name: "Niran", hometown: "Bangkok",
  },
  {
    example: true,
    place: "Ubud, Bali", date: "June 2024", x: 794.3, y: 275.7,
    question: "Advice for people in their 20s",
    answer: "Don’t rush to become someone. Take the time to find out who you already are.",
    name: "Kadek", hometown: "Denpasar",
  },
  {
    example: true,
    place: "Byron Bay, Australia", date: "August 2024", x: 878.6, y: 335.2,
    question: "What makes a good friend?",
    answer: "Someone who remembers the little things you told them months ago.",
    name: "Jess", hometown: "Brisbane",
  },
  {
    example: true,
    place: "Melbourne, Australia", date: "September 2024", x: 846.1, y: 362.6,
    question: "A lesson that had great impact on you",
    answer: "Strangers are only strangers until you ask them a real question.",
    name: "Tom", hometown: "Hobart",
  },
];

const SVG_NS = "http://www.w3.org/2000/svg";
// the map is the one colourful thing on the page: one ink per person
const DOT_COLOURS = ["#ff5a1f", "#1f3ddb", "#ff4f8b", "#f2a900", "#11a07a"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const map = document.querySelector(".hero .map");
const peopleLayer = map.querySelector(".people");
const route = map.querySelector(".route");
const routeMask = map.querySelector(".route-mask");

const card = document.getElementById("card");
const el = (sel) => card.querySelector(sel);
let current = -1;
let lastTrigger = null;

/* --- journey line: gentle arcs from person to person --- */
function buildRoute(points) {
  if (points.length < 2) return "";
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y;
    const bend = 0.22;
    d += ` Q${(mx + dy * bend).toFixed(1)} ${(my - dx * bend).toFixed(1)} ${b.x} ${b.y}`;
  }
  return d;
}
const routeD = buildRoute(PEOPLE);
route.setAttribute("d", routeD);
routeMask.setAttribute("d", routeD);

/* --- people dots --- */
PEOPLE.forEach((p, i) => {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "person");
  g.setAttribute("tabindex", "0");
  g.setAttribute("role", "button");
  g.setAttribute("aria-label", `${p.name} in ${p.place}${p.example ? " (example)" : ""}`);
  g.dataset.index = i;

  const hit = document.createElementNS(SVG_NS, "circle");
  hit.setAttribute("class", "hit");
  hit.setAttribute("cx", p.x); hit.setAttribute("cy", p.y); hit.setAttribute("r", 18);

  const ring = document.createElementNS(SVG_NS, "circle");
  ring.setAttribute("class", "ring");
  ring.setAttribute("cx", p.x); ring.setAttribute("cy", p.y); ring.setAttribute("r", 6);
  ring.style.animationDelay = `${i * 0.45}s`;

  g.style.setProperty("--c", DOT_COLOURS[i % DOT_COLOURS.length]);

  const core = document.createElementNS(SVG_NS, "circle");
  core.setAttribute("class", "core");
  core.setAttribute("cx", p.x); core.setAttribute("cy", p.y); core.setAttribute("r", 6);

  const label = document.createElementNS(SVG_NS, "text");
  label.setAttribute("class", "person-label");
  const city = p.place.split(",")[0];
  label.textContent = city;
  // keep the two Australian labels from overlapping
  const left = p.x > 860 ? false : p.x > 820;
  label.setAttribute("x", left ? p.x - 14 : p.x + 14);
  label.setAttribute("y", p.y + 4);
  label.setAttribute("text-anchor", left ? "end" : "start");

  g.append(hit, ring, core, label);
  g.addEventListener("click", () => open(i, g));
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i, g); }
  });
  peopleLayer.appendChild(g);
});

/* --- the one orchestrated moment: draw the journey, then the dots start breathing --- */
function startMap() {
  const len = routeMask.getTotalLength();
  if (reduceMotion) {
    map.classList.add("is-live");
    return;
  }
  routeMask.style.strokeDasharray = len;
  routeMask.style.strokeDashoffset = len;
  routeMask.getBoundingClientRect();
  routeMask.style.transition = "stroke-dashoffset 2.4s cubic-bezier(.45,.05,.25,1)";
  routeMask.style.strokeDashoffset = "0";
  setTimeout(() => map.classList.add("is-live"), 1900);
}
/* --- intro: the book opens, then the map appears --- */
const intro = document.getElementById("intro");
let introDone = false;
const timers = [];

function finishIntro() {
  if (introDone) return;
  introDone = true;
  timers.forEach(clearTimeout);
  intro.classList.add("is-open", "is-zoom");
  document.body.classList.remove("intro-on");
  try { sessionStorage.setItem("ww-intro-seen", "1"); } catch (e) {}
  setTimeout(() => { intro.hidden = true; }, 1100);
  setTimeout(startMap, 500);
}

function playIntro() {
  let seen = false;
  try { seen = sessionStorage.getItem("ww-intro-seen") === "1"; } catch (e) {}
  if (reduceMotion || seen) {
    intro.hidden = true;
    introDone = true;
    startMap();
    return;
  }
  document.body.classList.add("intro-on");
  timers.push(setTimeout(() => intro.classList.add("is-in"), 80));
  timers.push(setTimeout(() => intro.classList.add("is-open"), 1000));
  timers.push(setTimeout(finishIntro, 3300));
  intro.addEventListener("click", finishIntro);
  document.addEventListener("keydown", (e) => { if (!introDone && e.key === "Escape") finishIntro(); });
}

const coverImg = intro.querySelector(".cover-front img");
const whenReady = (fn) => {
  let started = false;
  const go = () => { if (!started) { started = true; fn(); } };
  if (coverImg.complete) go(); else coverImg.addEventListener("load", go);
  setTimeout(go, 1200);
};
whenReady(playIntro);

/* --- journal card --- */
function open(i, trigger) {
  const p = PEOPLE[i];
  current = i;
  if (trigger) lastTrigger = trigger;

  el(".card-example").hidden = !p.example;
  el(".card-place").textContent = p.place;
  el(".card-date").textContent = p.date;
  el(".card-question").textContent = p.question;
  el(".card-answer").textContent = p.answer;
  el(".card-name").textContent = p.name;
  el(".card-home").textContent = p.hometown;

  peopleLayer.querySelectorAll(".person").forEach((g) =>
    g.classList.toggle("is-active", Number(g.dataset.index) === i));

  card.classList.toggle("on-left", p.x > 520);
  const wasHidden = card.hidden;
  card.hidden = false;
  card.classList.remove("is-entering");
  void card.offsetWidth;
  card.classList.add("is-entering");
  if (wasHidden) el(".card-next").focus({ preventScroll: true });
}

function close() {
  card.hidden = true;
  peopleLayer.querySelectorAll(".person").forEach((g) => g.classList.remove("is-active"));
  if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  current = -1;
}

el(".card-next").addEventListener("click", () => {
  const next = (current + 1) % PEOPLE.length;
  open(next, peopleLayer.querySelector(`[data-index="${next}"]`));
});
el(".card-close").addEventListener("click", close);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !card.hidden) close(); });

/* --- keep the dashed path in "How to use it" lined up with the steps --- */
const howPath = document.querySelector(".how-path");
const steps = document.querySelector(".steps");
function fitHowPath() {
  if (!howPath || !steps) return;
  const how = steps.closest(".how");
  const top = steps.offsetTop;
  howPath.style.setProperty("--steps-top", `${top}px`);
  howPath.style.setProperty("--steps-h", `${steps.offsetHeight}px`);
  // move each bend to the number circle of its step
  const items = [...steps.children];
  const w = howPath.getBoundingClientRect().width || 1;
  const left = howPath.getBoundingClientRect().left;
  const pts = items.map((li) => {
    const r = li.getBoundingClientRect(), base = steps.getBoundingClientRect();
    return [((r.left - left + 21) / w) * 100, ((r.top - base.top + 21) / steps.offsetHeight) * 600];
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], k = (y1 - y0) * 0.55;
    d += ` C ${x0.toFixed(1)} ${(y0 + k).toFixed(1)}, ${x1.toFixed(1)} ${(y1 - k).toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  howPath.querySelector("path").setAttribute("d", d);
}
window.addEventListener("load", fitHowPath);
window.addEventListener("resize", fitHowPath);
document.fonts && document.fonts.ready.then(fitHowPath);
