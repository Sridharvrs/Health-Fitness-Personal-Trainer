
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Current year
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Go back button
  const goBack = document.getElementById("goBack");

  goBack?.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });
});
