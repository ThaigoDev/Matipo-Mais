// Matipó + — interações do site público
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const normalize = (text) =>
    (text || "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

  // ---------- Header ----------
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $(".nav-toggle");
  const nav = $(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.innerHTML = open ? '<i class="ph-bold ph-x"></i>' : '<i class="ph-bold ph-list"></i>';
    });
  }

  // ---------- Busca + filtros ----------
  const cards = $$(".listing-card");
  const searchInputs = $$("[data-search-input]");
  const chips = $$("[data-filter]");
  let query = "";
  let statusFilter = "all";

  function applyFilters() {
    const q = normalize(query);

    $$("[data-filterable]").forEach((group) => {
      let visible = 0;
      $$(".listing-card", group).forEach((card) => {
        const matchesText = !q || normalize(card.dataset.search).includes(q);
        const matchesStatus = statusFilter === "all" || card.dataset.status === statusFilter;
        const show = matchesText && matchesStatus;
        card.hidden = !show;
        if (show) visible++;
      });
      const empty = group.parentElement.querySelector("[data-empty]");
      if (empty) empty.hidden = visible > 0 || !$$(".listing-card", group).length;
      const section = group.closest("[data-section]");
      if (section && q) section.hidden = visible === 0;
      else if (section) section.hidden = false;
    });

    $$("[data-count]").forEach((el) => {
      el.textContent = cards.filter((c) => !c.hidden).length;
    });
    updateCarouselButtons();
  }

  searchInputs.forEach((input) => {
    input.addEventListener("input", () => {
      query = input.value;
      searchInputs.forEach((other) => other !== input && (other.value = query));
      if (cards.length) applyFilters();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !cards.length && input.value.trim()) {
        window.location.href = "/?q=" + encodeURIComponent(input.value.trim());
      }
    });
  });

  $$("[data-search-form]").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = $("[data-results]");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.toggle("is-active", c === chip));
      statusFilter = chip.dataset.filter;
      applyFilters();
    })
  );

  const initialQuery = new URLSearchParams(window.location.search).get("q");
  if (initialQuery && cards.length) {
    query = initialQuery;
    searchInputs.forEach((input) => (input.value = initialQuery));
    applyFilters();
  }

  // ---------- Carrosséis ----------
  function updateCarouselButtons() {
    $$("[data-carousel]").forEach((track) => {
      const id = track.id;
      const prev = $(`[data-prev="${id}"]`);
      const next = $(`[data-next="${id}"]`);
      if (!prev || !next) return;
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    });
  }

  $$("[data-carousel]").forEach((track) => {
    const id = track.id;
    const step = () => track.clientWidth * 0.9;
    const prev = $(`[data-prev="${id}"]`);
    const next = $(`[data-next="${id}"]`);
    prev && prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
    next && next.addEventListener("click", () => track.scrollBy({ left: step() }));
    track.addEventListener("scroll", updateCarouselButtons, { passive: true });
  });
  window.addEventListener("resize", updateCarouselButtons);
  updateCarouselButtons();

  // ---------- Reveal ----------
  const revealables = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-visible"));
  }
})();
