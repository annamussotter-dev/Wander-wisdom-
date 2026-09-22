// ---------- Config ----------
// Drop in your real checkout links (Stripe Payment Links, Gumroad, Shopify, etc.)
// once you have them. Until then, buy buttons show a friendly notice.
const CHECKOUT_LINKS = {
  "Wander Wisdom — Digital Edition": "",
  "Wander Wisdom — Printed Journal": "",
  "Wander Wisdom — Gift Set": "",
};

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Mobile nav ----------
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("main-nav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- Toast ----------
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

// ---------- Buy buttons ----------
document.querySelectorAll(".buy-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const product = btn.dataset.product;
    const link = CHECKOUT_LINKS[product];

    if (link) {
      // Real checkout link configured — let it navigate normally.
      return;
    }

    e.preventDefault();
    showToast(`Checkout isn't connected yet for "${product}" — add your payment link in script.js.`);
  });
});

// ---------- Email signup ----------
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) return;
  showToast(`Thanks! We'll send updates to ${email}.`);
  signupForm.reset();
});
