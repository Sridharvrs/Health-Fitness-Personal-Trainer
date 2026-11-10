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

  // =====================================
  // STATIC TRAINER DASHBOARD DATA
  // =====================================

  const clients = [
    { id: 1, name: "John Carter", email: "john@gmail.com", goal: "Muscle Gain", status: "Active", sessions: 18, progress: 75 },
    { id: 2, name: "Emma Wilson", email: "emma@gmail.com", goal: "Weight Loss", status: "Active", sessions: 12, progress: 60 },
    { id: 3, name: "Michael Brown", email: "michael@gmail.com", goal: "Strength", status: "Active", sessions: 22, progress: 85 },
    { id: 4, name: "Sophia Davis", email: "sophia@gmail.com", goal: "Fitness", status: "Inactive", sessions: 5, progress: 30 },
    { id: 5, name: "Daniel Miller", email: "daniel@gmail.com", goal: "Muscle Gain", status: "Active", sessions: 15, progress: 70 },
    { id: 6, name: "Olivia Taylor", email: "olivia@gmail.com", goal: "Weight Loss", status: "Inactive", sessions: 8, progress: 40 }
  ];

  const workoutLogs = [
    { id: 1, member_name: "John Carter", workout_type: "Strength Training", duration_minutes: 60, intensity: "High", notes: "Excellent performance", logged_on: "2026-11-10" },
    { id: 2, member_name: "Emma Wilson", workout_type: "Cardio", duration_minutes: 45, intensity: "Medium", notes: "Good stamina", logged_on: "2026-11-10" },
    { id: 3, member_name: "Michael Brown", workout_type: "Upper Body", duration_minutes: 55, intensity: "High", notes: "Increased weights", logged_on: "2026-11-09" },
    { id: 4, member_name: "Daniel Miller", workout_type: "Leg Day", duration_minutes: 65, intensity: "High", notes: "Strong session", logged_on: "2026-11-09" },
    { id: 5, member_name: "Sophia Davis", workout_type: "Yoga", duration_minutes: 40, intensity: "Low", notes: "Mobility improvement", logged_on: "2026-11-08" },
    { id: 6, member_name: "Olivia Taylor", workout_type: "Cardio", duration_minutes: 35, intensity: "Medium", notes: "Completed session", logged_on: "2026-11-08" }
  ];

  const programs = [
    { name: "Iron Foundations", type: "Strength", duration: "12 Weeks", sessions: "4 Sessions / Week", level: "Advanced" },
    { name: "Engine Builder", type: "Cardio", duration: "10 Weeks", sessions: "5 Sessions / Week", level: "All Levels" },
    { name: "Flow & Flex", type: "Mobility", duration: "8 Weeks", sessions: "3 Sessions / Week", level: "Beginner" },
    { name: "Pull & Push Power", type: "Strength", duration: "14 Weeks", sessions: "4 Sessions / Week", level: "Intermediate" },
    { name: "Total Reset", type: "Lifestyle", duration: "16 Weeks", sessions: "5 Sessions / Week", level: "All Levels" }
  ];

  // =====================================
  // HELPER FUNCTIONS
  // =====================================

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const toast = (message) => {
    const element = $("#toast");
    if (!element) return;

    element.textContent = message;
    element.classList.add("show");

    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      element.classList.remove("show");
    }, 2500);
  };

  // =====================================
  // SIDEBAR NAVIGATION
  // =====================================

  const sidebar = $("#sidebar");
  const overlay = $("#overlay");
  const menuBtn = $("#menuBtn");

  function closeSidebar() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");
  }

  menuBtn?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
    overlay?.classList.toggle("show");
  });

  overlay?.addEventListener("click", closeSidebar);

  function showPage(pageName) {
    $$(".dash-page").forEach(page => {
      page.hidden = page.dataset.page !== pageName;
    });

    $$(".nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.id === pageName);
    });

    const activeItem = $(`.nav-item[data-id="${pageName}"]`);
    const title = activeItem?.textContent.trim() || "Overview";

    if ($("#pageTitle")) $("#pageTitle").textContent = title;
    if ($("#crumb")) $("#crumb").textContent = "Dashboard";

    closeSidebar();
  }

  $$(".nav-item").forEach(item => {
    item.addEventListener("click", event => {
      event.preventDefault();
      showPage(item.dataset.id);
    });
  });

  showPage("overview");

  // =====================================
  // TRAINER PROFILE
  // =====================================

  if ($("#sbName")) $("#sbName").textContent = "Alex Morgan";
  if ($("#sbRole")) $("#sbRole").textContent = "Trainer";
  if ($("#sbAvatar")) $("#sbAvatar").textContent = "A";

  if ($("#todayLabel")) {
    $("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  // =====================================
  // OVERVIEW - RECENT WORKOUTS
  // =====================================

  function renderRecentLogs() {
    const container = $("#recentLogs");
    if (!container) return;

    container.innerHTML = workoutLogs.slice(0, 4).map(log => `
      <div class="recent-log-item">
        <div>
          <strong>${escapeHTML(log.member_name)}</strong>
          <p>${escapeHTML(log.workout_type)}</p>
        </div>
        <span>${log.duration_minutes} min</span>
      </div>
    `).join("");
  }

  renderRecentLogs();

  // =====================================
  // CLIENTS
  // =====================================

  function renderClients() {
    const container = $("#clientRows");
    if (!container) return;

    const search = ($("#clientSearch")?.value || "").toLowerCase();
    const status = $("#clientStatus")?.value || "all";

    const filtered = clients.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search);

      const matchesStatus =
        status === "all" ||
        client.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    container.innerHTML = filtered.map(client => `
      <tr>
        <td>${escapeHTML(client.name)}</td>
        <td>${escapeHTML(client.goal)}</td>
        <td>${client.sessions}</td>
        <td><span class="status ${client.status.toLowerCase()}">${client.status}</span></td>
        <td>
          <button class="view-client" data-client="${client.id}">View</button>
        </td>
      </tr>
    `).join("");

    if (!filtered.length) {
      container.innerHTML = `<tr><td colspan="5">No clients found.</td></tr>`;
    }
  }

  $("#clientSearch")?.addEventListener("input", renderClients);
  $("#clientStatus")?.addEventListener("change", renderClients);

  $("#clientRows")?.addEventListener("click", event => {
    const button = event.target.closest("[data-client]");
    if (!button) return;

    const client = clients.find(c => c.id === Number(button.dataset.client));
    if (!client || !$("#clientDetail")) return;

    $("#clientDetail").innerHTML = `
      <h3>${escapeHTML(client.name)}</h3>
      <p>${escapeHTML(client.email)}</p>
      <p>Goal: ${escapeHTML(client.goal)}</p>
      <p>Sessions Completed: ${client.sessions}</p>
      <p>Progress: ${client.progress}%</p>
      <p>Status: ${escapeHTML(client.status)}</p>
    `;
  });

  renderClients();

  // =====================================
  // SESSION LOGS
  // =====================================

  function renderWorkoutLogs() {
    const container = $("#logTable");
    if (!container) return;

    const filter = $("#typeFilter")?.value || "all";

    const filtered = workoutLogs.filter(log =>
      filter === "all" ||
      log.workout_type.toLowerCase().includes(filter.toLowerCase())
    );

    container.innerHTML = filtered.map(log => `
      <tr>
        <td>${escapeHTML(log.member_name)}</td>
        <td>${escapeHTML(log.workout_type)}</td>
        <td>${log.duration_minutes} min</td>
        <td>${escapeHTML(log.intensity)}</td>
        <td>${escapeHTML(log.logged_on)}</td>
      </tr>
    `).join("");

    if (!filtered.length) {
      container.innerHTML = `<tr><td colspan="5">No workout logs found.</td></tr>`;
    }

    if ($("#shownCount")) {
      $("#shownCount").textContent = filtered.length;
    }

    if ($("#logsTotal")) {
      $("#logsTotal").textContent = workoutLogs.length;
    }

    if ($("#logsMinutes")) {
      $("#logsMinutes").textContent = workoutLogs.reduce(
        (total, log) => total + log.duration_minutes, 0
      );
    }

    if ($("#logsMembers")) {
      $("#logsMembers").textContent = new Set(
        workoutLogs.map(log => log.member_name)
      ).size;
    }
  }

  $("#typeFilter")?.addEventListener("change", renderWorkoutLogs);
  $("#refreshLogs")?.addEventListener("click", () => {
    renderWorkoutLogs();
    toast("Workout logs refreshed");
  });

  renderWorkoutLogs();

  // =====================================
  // PROGRAMS
  // =====================================

  $$("[data-program]").forEach(button => {
    button.addEventListener("click", () => {
      const program = programs[Number(button.dataset.program)];
      if (!program) return;

      if ($("#builderName")) {
        $("#builderName").textContent = program.name;
      }

      if ($("#builderMeta")) {
        $("#builderMeta").textContent =
          `${program.type} • ${program.duration} • ${program.sessions} • ${program.level}`;
      }

      if ($("#builderPhases")) {
        $("#builderPhases").innerHTML = `
          <div class="phase-item">
            <strong>Phase 1 — Foundation</strong>
            <p>Build consistency and develop proper exercise technique.</p>
          </div>
          <div class="phase-item">
            <strong>Phase 2 — Progression</strong>
            <p>Gradually increase training intensity and workload.</p>
          </div>
          <div class="phase-item">
            <strong>Phase 3 — Performance</strong>
            <p>Focus on performance, strength and measurable progress.</p>
          </div>
        `;
      }

      toast(`${program.name} selected`);
    });
  });

  // =====================================
  // LOGOUT BUTTONS
  // =====================================

  $$("[data-logout]").forEach(button => {
    button.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  });

  // =====================================
  // GENERAL TOAST BUTTONS
  // =====================================

  $$("[data-toast]").forEach(button => {
    button.addEventListener("click", () => {
      toast(button.dataset.toast);
    });
  });

})();