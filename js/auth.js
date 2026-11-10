/* =========================================
   PULSEFIT — LOGIN & SIGNUP
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const loginView = document.getElementById("loginView");
  const signupView = document.getElementById("signupView");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const roleCards = document.querySelectorAll(
    "#loginView .role-option"
  );

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  const loginMessage = document.getElementById("loginMessage");
  const signupMessage = document.getElementById("signupMessage");

  const loginButton = document.getElementById("loginSubmit");
  const signupButton = document.getElementById("signupSubmit");

  const loginButtonText = document.getElementById("loginButtonText");
  const loginEmailLabel = document.getElementById("loginEmailLabel");

  if (!loginForm || !signupForm) return;

  let selectedRole = "member";

  /* ---------- Dashboard routes ---------- */

  const dashboardRoutes = {
    member: "./member-dashboard.html",
    trainer: "./trainer-dashboard.html"
  };

  /* ---------- Switch views ---------- */

  function showLogin() {
    loginView.hidden = false;
    signupView.hidden = true;

    clearMessage(loginMessage);
    clearMessage(signupMessage);
  }

  function showSignup() {
    loginView.hidden = true;
    signupView.hidden = false;

    clearMessage(loginMessage);
    clearMessage(signupMessage);
  }

  document.getElementById("showSignup")?.addEventListener("click", (e) => {
    e.preventDefault();
    showSignup();
  });

  document.getElementById("showLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  /* ---------- Role selection ---------- */

  function selectRole(role) {
    if (!dashboardRoutes[role]) return;

    selectedRole = role;

    roleCards.forEach((card) => {
      const active = card.dataset.role === role;

      card.classList.toggle("active", active);
      card.setAttribute("aria-pressed", String(active));
    });

    loginButtonText.textContent =
      role === "trainer" ? "Trainer Login" : "Member Login";

    loginEmailLabel.textContent =
      role === "trainer" ? "Trainer Email" : "Member Email";

    loginEmail.placeholder =
      role === "trainer"
        ? "Enter your trainer email"
        : "Enter your member email";

    clearMessage(loginMessage);
  }

  roleCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectRole(card.dataset.role);
    });
  });

  /* ---------- Password visibility ---------- */

  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(
        button.dataset.togglePassword
      );

      if (!input) return;

      const show = input.type === "password";
      input.type = show ? "text" : "password";

      const icon = button.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-eye", !show);
        icon.classList.toggle("fa-eye-slash", show);
        icon.classList.toggle("fa-regular", !show);
        icon.classList.toggle("fa-solid", show);
      }

      button.setAttribute(
        "aria-label",
        show ? "Hide password" : "Show password"
      );
    });
  });

  /* ---------- Validation helpers ---------- */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  function showMessage(element, message, success = false) {
    if (!element) return;

    element.textContent = message;
    element.classList.add("show");
    element.classList.toggle("success", success);
    element.classList.toggle("error", !success);
  }

  function clearMessage(element) {
    if (!element) return;

    element.textContent = "";
    element.classList.remove("show", "success", "error");
  }

  function clearOnTyping(form, message) {
    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        clearMessage(message);
      });
    });
  }

  clearOnTyping(loginForm, loginMessage);
  clearOnTyping(signupForm, signupMessage);

  /* ---------- Login submission ---------- */

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage(loginMessage);

    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    if (!email) {
      showMessage(loginMessage, "Please enter your email address.");
      loginEmail.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage(loginMessage, "Please enter a valid email address.");
      loginEmail.focus();
      return;
    }

    if (!password.trim()) {
      showMessage(loginMessage, "Please enter your password.");
      loginPassword.focus();
      return;
    }

    const currentUser = {
      name: email.split("@")[0],
      email: email,
      role: selectedRole
    };

    const remember = document.getElementById("remember").checked;

    try {
      localStorage.removeItem("stacklyCurrentUser");
      sessionStorage.removeItem("stacklyCurrentUser");

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem(
        "stacklyCurrentUser",
        JSON.stringify(currentUser)
      );

    } catch (error) {
      console.error("Session storage error:", error);

      showMessage(
        loginMessage,
        "Unable to save your session. Please check browser storage."
      );

      return;
    }

    loginButton.disabled = true;
    loginButton.classList.add("loading");
    loginButtonText.textContent = "Signing in...";

    setTimeout(() => {
      window.location.href = dashboardRoutes[selectedRole];
    }, 500);
  });

  /* ---------- Signup submission ---------- */

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage(signupMessage);

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();

    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const terms = document.getElementById("signupTerms");

    if (name.length < 3) {
      showMessage(signupMessage, "Please enter your full name.");
      document.getElementById("signupName").focus();
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage(signupMessage, "Please enter a valid email address.");
      document.getElementById("signupEmail").focus();
      return;
    }

    if (!passwordRegex.test(password)) {
      showMessage(
        signupMessage,
        "Password must have at least 8 characters, uppercase, lowercase, number and special character."
      );

      document.getElementById("signupPassword").focus();
      return;
    }

    if (password !== confirmPassword) {
      showMessage(signupMessage, "Passwords do not match.");
      document.getElementById("confirmPassword").focus();
      return;
    }

    if (!terms.checked) {
      showMessage(
        signupMessage,
        "Please accept the Terms and Privacy Policy."
      );

      terms.focus();
      return;
    }

    signupButton.disabled = true;
    signupButton.classList.add("loading");
    signupButton.querySelector("span").textContent = "Creating Account...";

    setTimeout(() => {
      signupButton.disabled = false;
      signupButton.classList.remove("loading");
      signupButton.querySelector("span").textContent = "Create Account";

      showMessage(
        signupMessage,
        "Your details are valid! Connect a backend to complete registration.",
        true
      );
    }, 1000);
  });

  /* ---------- Initial state ---------- */

  selectRole("member");
  showLogin();

});