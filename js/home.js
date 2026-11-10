/* HOME — page-specific motion + interactions */
(function () {
  // Parallax on hero background
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg) {
    window.addEventListener("scroll", function () {
      const y = window.scrollY;
      if (y < window.innerHeight) heroBg.style.transform = `translateY(${y * 0.4}px) scale(1.05)`;
    }, { passive: true });
  }

  // Subtle tilt on pillar cards
  document.querySelectorAll(".pillar-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const r = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${cy * -6}deg) rotateY(${cx * 6}deg)`;
    });
    card.addEventListener("mouseleave", function () { card.style.transform = ""; });
  });
})();
