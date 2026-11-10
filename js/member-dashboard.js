// Get the logged-in user
const currentUser = JSON.parse(
  localStorage.getItem("stacklyCurrentUser") ||
  sessionStorage.getItem("stacklyCurrentUser") ||
  "null"
);

if (currentUser?.name) {
  // Display dynamic name
  document.querySelectorAll(".profileName").forEach((element) => {
    element.textContent = currentUser.name;
  });

  // Display first letter in avatar
  const firstLetter = currentUser.name.trim().charAt(0).toUpperCase();

  document.querySelectorAll(".avatar").forEach((element) => {
    element.textContent = firstLetter;
  });
}

// ==========================================================================================================

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const sidebar = $("#sidebar");
  const overlay = $("#overlay");
  const menuBtn = $("#menuBtn");

  // =====================================
  // TOAST
  // =====================================

  let toastTimer;

  function toast(message) {
    const el = $("#toast");

    el.textContent = message;
    el.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      el.classList.remove("show");
    }, 2800);
  }

  // =====================================
  // SIDEBAR
  // =====================================

  function setMenu(open) {
    sidebar.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
    menuBtn.classList.toggle("open", open);

    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  menuBtn.addEventListener("click", () => {
    setMenu(!sidebar.classList.contains("open"));
  });

  overlay.addEventListener("click", () => setMenu(false));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenu(false);
  });

  // =====================================
  // PAGE NAVIGATION
  // =====================================

  const pageTitles = {
    overview: "Your Dashboard",
    log: "Log a Workout",
    progress: "Your Progress",
    schedule: "Your Schedule",
    plan: "My Training Plan",
    account: "Account Settings"
  };

  function showPage(pageName) {
    const page = $(`[data-page="${pageName}"]`);

    if (!page) return;

    $$(".dash-page").forEach(section => {
      section.hidden = section.dataset.page !== pageName;
    });

    $$(".nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.id === pageName);
    });

    $("#pageTitle").textContent = pageTitles[pageName];
    $("#crumb").textContent = "Member Dashboard";

    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate() {
    const page = location.hash.replace("#", "") || "overview";
    showPage(page);
  }

  $$(".nav-item").forEach(item => {
    item.addEventListener("click", event => {
      event.preventDefault();
      location.hash = item.dataset.id;
    });
  });

  document.addEventListener("click", event => {
    const goButton = event.target.closest("[data-go]");

    if (goButton) {
      location.hash = goButton.dataset.go;
      return;
    }
  });

  window.addEventListener("hashchange", navigate);

  // =====================================
  // DATE AND PROFILE
  // =====================================

  $("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  function updateIdentity(name) {
    $("#sbName").textContent = name;
    $("#sbAvatar").textContent = name
      .split(" ")
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  // =====================================
  // LOG WORKOUT - DEMO ONLY
  // =====================================

  const logForm = $("#logForm");
  const logList = $("#logList");

  const today = new Date();
  const todayISO = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  ).toISOString().slice(0, 10);

  $("#logDate").value = todayISO;
  $("#logDate").max = todayISO;

  $("#logIntensity").addEventListener("input", event => {
    $("#intensityOut").textContent = event.target.value;
  });

  logForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!logForm.checkValidity()) {
      logForm.reportValidity();
      return;
    }

    const type = $("#logType").value;
    const duration = $("#logDuration").value;
    const date = new Date($("#logDate").value + "T00:00:00")
      .toLocaleDateString("en-IN", { month: "short", day: "numeric" });

    const intensity = $("#logIntensity").value;
    const notes = $("#logNotes").value.trim();

    const item = document.createElement("div");
    item.className = "list-item";

    const main = document.createElement("div");
    main.className = "li-main";

    const icon = document.createElement("div");
    icon.className = "li-icon";
    icon.textContent = "↗";

    const details = document.createElement("div");
    const title = document.createElement("strong");
    const subtitle = document.createElement("span");

    title.textContent = `${type} · ${duration} min`;
    subtitle.textContent = `${date} · Effort ${intensity}${notes ? " · " + notes : ""}`;

    details.append(title, subtitle);
    main.append(icon, details);

    const remove = document.createElement("button");
    remove.className = "btn-danger";
    remove.type = "button";
    remove.dataset.delete = "";
    remove.textContent = "Delete";

    item.append(main, remove);
    logList.prepend(item);

    logForm.reset();

    $("#logDate").value = todayISO;
    $("#logIntensity").value = 6;
    $("#intensityOut").textContent = "6";

    toast("Demo workout added successfully!");
  });

  logList.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");

    if (!button) return;

    button.closest(".list-item").remove();
    toast("Demo workout removed");
  });

  // =====================================
  // SCHEDULE - DEMO ONLY
  // =====================================

  const upList = $("#upList");

  function updateBookingCount() {
    const count = $$("[data-session]", upList).length;

    $("#upCount").textContent = `${count} booked`;

    if (!count) {
      upList.innerHTML = `
        <div class="empty">
          <strong>No sessions booked</strong>
          Use the form to request your next session.
        </div>
      `;
    }
  }

  upList.addEventListener("click", event => {
    const button = event.target.closest("[data-cancel]");

    if (!button) return;

    button.closest("[data-session]").remove();

    updateBookingCount();
    toast("Demo session cancelled");
  });

  $("#bkDate").min = todayISO;

  $("#bookForm").addEventListener("submit", event => {
    event.preventDefault();

    const date = $("#bkDate").value;

    if (!date) {
      $("#bkDate").reportValidity();
      return;
    }

    const trainer = $("#bkTrainer").value;
    const time = $("#bkTime").value;

    const formattedDate = new Date(date + "T00:00:00")
      .toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
      });

    toast(`Demo booking: ${formattedDate} at ${time} with ${trainer}`);

    event.target.reset();
    $("#bkDate").min = todayISO;
  });

  // =====================================
  // TRAINING PLAN CHECKLIST
  // =====================================

  const planBoxes = $$("[data-plan]");
  const planTotal = planBoxes.length;

  function updatePlanProgress() {
    const completed = planBoxes.filter(box => box.checked).length;
    const percent = Math.round((completed / planTotal) * 100);

    $("#planPct").textContent = `${percent}% complete`;
    $("#planBar").style.setProperty("--w", `${percent}%`);
  }

  planBoxes.forEach(box => {
    box.addEventListener("change", () => {
      box.closest(".check").classList.toggle("done", box.checked);
      updatePlanProgress();
    });
  });

  updatePlanProgress();

  // =====================================
  // ACCOUNT PROFILE - DEMO ONLY
  // =====================================

  $("#profileForm").addEventListener("submit", event => {
    event.preventDefault();

    if (!event.target.checkValidity()) {
      event.target.reportValidity();
      return;
    }

    const name = $("#pfName").value.trim();

    updateIdentity(name);
    $("#logName").value = name;

    toast("Demo profile updated");
  });

  // =====================================
  // LOGOUT
  // =====================================

  $$("[data-logout]").forEach(button => {
    button.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  });

  // =====================================
  // INITIAL PAGE
  // =====================================

  if (!pageTitles[location.hash.replace("#", "")]) {
    history.replaceState(null, "", "#overview");
  }

  navigate();

})();