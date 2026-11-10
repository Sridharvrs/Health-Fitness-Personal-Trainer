/* TRAINERS — card 3D tilt on hover */
(function () {
  document.querySelectorAll(".tr-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener("mouseleave", function () { card.style.transform = ""; });
  });
})();
