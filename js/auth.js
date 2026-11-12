
/* =========================================
   PULSEFIT - AUTHENTICATION
   Demo Login & Signup
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTS =====
  const loginView = document.getElementById("loginView");
  const signupView = document.getElementById("signupView");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  const signupName = document.getElementById("signupName");
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const signupTerms = document.getElementById("signupTerms");

  const loginMessage = document.getElementById("loginMessage");
  const signupMessage = document.getElementById("signupMessage");

  const loginSubmit = document.getElementById("loginSubmit");
  const signupSubmit = document.getElementById("signupSubmit");

  const loginButtonText = document.getElementById("loginButtonText");

  const loginEmailLabel = document.getElementById("loginEmailLabel");

  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");

  // ===== DASHBOARD ROUTES =====
  const dashboardRoutes = {
    member: "./member-dashboard.html",
    trainer: "./trainer-dashboard.html"
  };

  const STORAGE_KEY = "stacklyCurrentUser";

  let selectedRole = "member";

  // ===== MESSAGE FUNCTIONS =====
  function showMessage(element, message, type = "error") {
    if (!element) return;

    element.textContent = message;
    element.className = `auth-message ${type}`;
    element.style.display = "block";
  }

  function clearMessage(element) {
    if (!element) return;

    element.textContent = "";
    element.style.display = "none";
  }

  // ===== VALIDATION =====
  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/.test(password);
  }

  // ===== ROLE SELECTION =====
  const roleOptions = document.querySelectorAll(
    "#loginView .role-option"
  );

  function selectRole(role) {
    if (!dashboardRoutes[role]) return;

    selectedRole = role;

    roleOptions.forEach(option => {
      const active = option.dataset.role === role;

      option.classList.toggle("active", active);
      option.setAttribute("aria-pressed", String(active));
    });

    if (loginEmailLabel) {
      loginEmailLabel.textContent =
        role === "trainer" ? "Trainer Email" : "Member Email";
    }

    if (loginButtonText) {
      loginButtonText.textContent =
        role === "trainer" ? "Trainer Login" : "Member Login";
    }

    clearMessage(loginMessage);
  }

  roleOptions.forEach(option => {
    option.addEventListener("click", () => {
      selectRole(option.dataset.role);
    });
  });

  // ===== SWITCH TO SIGNUP =====
  if (showSignup) {
    showSignup.addEventListener("click", event => {
      event.preventDefault();

      loginView.hidden = true;
      signupView.hidden = false;

      clearMessage(loginMessage);
      clearMessage(signupMessage);
    });
  }

  // ===== SWITCH TO LOGIN =====
  if (showLogin) {
    showLogin.addEventListener("click", event => {
      event.preventDefault();

      signupView.hidden = true;
      loginView.hidden = false;

      clearMessage(loginMessage);
      clearMessage(signupMessage);
    });
  }

  // ===== PASSWORD VISIBILITY =====
  document.querySelectorAll("[data-toggle-password]").forEach(button => {
    button.addEventListener("click", () => {
      const inputId = button.dataset.togglePassword;
      const input = document.getElementById(inputId);
      const icon = button.querySelector("i");

      if (!input) return;

      const isPassword = input.type === "password";

      input.type = isPassword ? "text" : "password";

      button.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );

      if (icon) {
        icon.classList.toggle("fa-eye", !isPassword);
        icon.classList.toggle("fa-eye-slash", isPassword);
      }
    });
  });

  // ===== LOGIN FORM =====
  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      clearMessage(loginMessage);

      const email = loginEmail.value.trim();
      const password = loginPassword.value;

      if (!validEmail(email)) {
        showMessage(loginMessage, "Please enter a valid email address.");
        return;
      }

      if (!validPassword(password)) {
        showMessage(
          loginMessage,
          "Password must contain at least 8 characters, uppercase, lowercase, number and special character."
        );
        return;
      }

      const currentUser = {
        name: email.split("@")[0],
        email: email,
        role: selectedRole,
        loginTime: new Date().toISOString()
      };

      const remember = document.getElementById("remember")?.checked;

      try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);

        const storage = remember ? localStorage : sessionStorage;

        storage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } catch (error) {
        showMessage(loginMessage, "Unable to save login details.");
        return;
      }

      // Disable button while redirecting
      if (loginSubmit) loginSubmit.disabled = true;

      if (loginButtonText) {
        loginButtonText.textContent = "Signing In...";
      }

      // Redirect based on selected role
      window.location.href = dashboardRoutes[selectedRole];
    });
  }

  // ===== SIGNUP FORM =====
  if (signupForm) {
    signupForm.addEventListener("submit", event => {
      event.preventDefault();

      clearMessage(signupMessage);

      const name = signupName.value.trim();
      const email = signupEmail.value.trim();
      const password = signupPassword.value;
      const confirm = confirmPassword.value;

      if (!name || !email || !password || !confirm) {
        showMessage(signupMessage, "Please fill in all fields.");
        return;
      }

      if (!validEmail(email)) {
        showMessage(signupMessage, "Please enter a valid email address.");
        return;
      }

      if (!validPassword(password)) {
        showMessage(
          signupMessage,
          "Password must contain at least 8 characters, uppercase, lowercase, number and special character."
        );
        return;
      }

      if (password !== confirm) {
        showMessage(signupMessage, "Passwords do not match.");
        return;
      }

      if (!signupTerms.checked) {
        showMessage(signupMessage, "Please accept the Terms and Privacy Policy.");
        return;
      }

      showMessage(
        signupMessage,
        "Account details validated successfully. Please sign in.",
        "success"
      );

      signupForm.reset();
    });
  }

  // ===== INITIAL STATE =====
  selectRole("member");

});
