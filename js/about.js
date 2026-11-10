/* ABOUT — gallery lightbox-style zoom on click */
(function () {
  document.querySelectorAll(".g-item").forEach(function (el) {
    el.addEventListener("click", function () {
      const box = document.createElement("div");
      box.style.cssText = "position:fixed;inset:0;z-index:200;background:rgba(4,8,9,0.92);display:flex;align-items:center;justify-content:center;padding:2rem;cursor:zoom-out;animation:fadeIn .3s";
      const img = document.createElement("div");
      img.style.cssText = "width:min(680px,100%);height:min(440px,80vh);background:" + this.style.backgroundImage + " center/cover;border-radius:14px;border:1px solid rgba(32,195,154,.4);box-shadow:0 20px 60px rgba(0,0,0,.6)";
      box.appendChild(img);
      document.body.appendChild(box);
      box.addEventListener("click", function () { document.body.removeChild(box); });
    });
  });

  // Timeline reveal stagger on scroll
  const items = document.querySelectorAll(".tl-item");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (es) {
      es.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add("in"), i * 150); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    items.forEach(it => io.observe(it));
  }
})();
