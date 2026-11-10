/* ===== PULSEFIT — SHARED JS =====
   Handles: header scroll, off-canvas menu, login modal,
   role selector, scroll-reveal, stat counters, active link.
   Shared across every page. */

(function () {
  "use strict";

  /* ---------- Header shrink on scroll ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Off-canvas mobile menu ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const offcanvas = document.querySelector(".offcanvas");
  const overlay = document.querySelector(".overlay");

  function closeMenu() {
    if (!offcanvas) return;
    offcanvas.classList.remove("open");
    overlay && overlay.classList.remove("open");
    toggle && toggle.classList.remove("open");
    document.body.style.overflow = "";
  }
  function openMenu() { 
    offcanvas.classList.add("open");
    overlay && overlay.classList.add("open");
    toggle && toggle.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  toggle && toggle.addEventListener("click", function () {
    offcanvas.classList.contains("open") ? closeMenu() : openMenu();
  });
  overlay && overlay.addEventListener("click", closeMenu);
  // Close on offcanvas link click
  offcanvas && offcanvas.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", function (e) {
      if (this.dataset.login !== undefined) return;
      closeMenu();
    })
  );

  /* ---------- Login modal ---------- */
  const modal = document.querySelector(".login-modal");
  const openers = document.querySelectorAll("[data-login]");
  const loginClose = document.querySelector(".login-close");

  function openLogin() {
    modal && modal.classList.add("open");
    document.body.style.overflow = "hidden";
    closeMenu();
  }
  function closeLogin() {
    modal && modal.classList.remove("open");
    document.body.style.overflow = "";
  }
  openers.forEach(o => o.addEventListener("click", function (e) { e.preventDefault(); openLogin(); }));
  loginClose && loginClose.addEventListener("click", closeLogin);
  modal && modal.addEventListener("click", function (e) {
    if (e.target === modal) closeLogin();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeLogin(); closeMenu(); }
  });

  /* ---------- Role selector inside login ---------- */
  const roles = document.querySelectorAll(".role-option");
  roles.forEach(r => r.addEventListener("click", function () {
    roles.forEach(x => x.classList.remove("active"));
    this.classList.add("active");
  }));

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("in"));
  }

  /* ---------- Animated stat counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const cObs = new IntersectionObserver(function (entries) {
      entries.forEach(en => {
        if (en.isIntersecting) { animateCount(en.target); cObs.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  /* ---------- Active nav link based on path ---------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .offcanvas .oc-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  /* Expose for page scripts */
  window.PulseFit = { closeMenu, openLogin, closeLogin };
})();
