/* PROGRAMS — filter logic */
(function () {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".prog-card");
  buttons.forEach(btn => btn.addEventListener("click", function () {
    buttons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    const f = this.dataset.filter;
    cards.forEach(card => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("hide", !show);
      if (show) {
        card.style.animation = "none";
        void card.offsetWidth;
        card.style.animation = "popIn 0.4s var(--ease-spring)";
      }
    });
  }));
})();


/* ==========================================
   PULSEFIT — PROGRAM MATCHER
========================================== */

(function () {
  "use strict";

  const options = document.querySelectorAll(".match-option");
  const findBtn = document.getElementById("findProgram");

  const title = document.getElementById("matchTitle");
  const description = document.getElementById("matchDescription");
  const tag = document.getElementById("matchTag");
  const result = document.getElementById("matchResult");

  if (!findBtn || !options.length) return;

  const recommendations = {
    strength: {
      title: "Iron Foundations",
      description:
        "Build a strong foundation through progressive resistance training and structured strength sessions.",
      tag: "STRENGTH",
      category: "strength"
    },

    cardio: {
      title: "Engine Builder",
      description:
        "Improve cardiovascular endurance through structured interval training and consistent conditioning.",
      tag: "CARDIO",
      category: "cardio"
    },

    mobility: {
      title: "Flow & Flex",
      description:
        "Improve flexibility, movement quality and joint mobility through guided movement routines.",
      tag: "MOBILITY",
      category: "mobility"
    },

    lifestyle: {
      title: "Total Reset",
      description:
        "Build a balanced fitness lifestyle with strength, cardio and recovery-focused training.",
      tag: "LIFESTYLE",
      category: "lifestyle"
    }
  };

  let selectedGoal = "strength";

  // Select a fitness goal
  options.forEach(option => {
    option.addEventListener("click", function () {

      options.forEach(item => item.classList.remove("active"));

      this.classList.add("active");

      selectedGoal = this.dataset.goal;

    });
  });

  // Find recommended program
  findBtn.addEventListener("click", function () {

    const recommendation = recommendations[selectedGoal];

    if (!recommendation) return;

    // Update recommendation
    title.textContent = recommendation.title;
    description.textContent = recommendation.description;
    tag.textContent = recommendation.tag;

    // Show updated result
    result.classList.remove("result-updated");

    void result.offsetWidth;

    result.classList.add("result-updated");

    // Activate existing program filter
    const filterButton = document.querySelector(
      `.filter-btn[data-filter="${recommendation.category}"]`
    );

    if (filterButton) {
      filterButton.click();
    }

    // Scroll to the programs section
    const programsSection = document.querySelector(".prog-cards-sec");

    if (programsSection) {
      setTimeout(() => {
        programsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 250);
    }

  });

})();

/* ==========================================
   MATCH RESULT ANIMATION
========================================== */
