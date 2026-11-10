/* CONTACT — form submit demo */
(function () {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "there").toString().split(" ")[0];
    note.textContent = "Thanks, " + name + "! Your request is in — we'll call you within 1 business day.";
    form.reset();
    note.style.color = "var(--success)";
    setTimeout(function () { note.textContent = ""; }, 6000);
  });
})();
