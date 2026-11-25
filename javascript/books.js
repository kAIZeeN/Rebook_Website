(() => {
  const page = document.querySelector(".books-page");
  const viewport = page?.querySelector(".carousel--books .carousel__track");
  const items = [...(page?.querySelectorAll(".book-item") || [])];
  const searchInput = document.querySelector(
    ".rebook-navbar .search-box input[type='search']"
  );
  const results = page?.querySelector(".books-results");
  const arrows = [...(page?.querySelectorAll("[data-books-direction]") || [])];
  const dots = [...(page?.querySelectorAll(".carousel__dots .carousel__dot") || [])];

  if (!page || !viewport || !searchInput || !results) return;

  const selectedValue = (name, fallback) =>
    document.querySelector(`input[name='${name}']:checked`)?.id || fallback;

  const applyFilters = () => {
    const status = selectedValue("status", "s-all").replace("s-", "");
    const category = selectedValue("category", "c-all").replace("c-", "");
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    items.forEach((item) => {
      const title = item.querySelector(".book-card__title")?.textContent.toLocaleLowerCase() || "";
      const matches = (status === "all" || item.dataset.status === status)
        && (category === "all" || item.dataset.cat === category)
        && (!query || title.includes(query));
      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    results.textContent = visibleCount === 1
      ? "Showing 1 book."
      : `Showing ${visibleCount} books.`;
    viewport.scrollTo({ left: 0, behavior: "auto" });
    updateDots();
  };

  const updateDots = () => {
    if (!dots.length) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const atEnd = maxScroll > 0 && viewport.scrollLeft >= maxScroll / 2;
    const activeIndex = atEnd ? dots.length - 1 : 0;
    dots.forEach((dot, index) => {
      const active = index === activeIndex;
      dot.classList.toggle("carousel__dot--active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  const scrollPage = (direction) => {
    const amount = Math.max(viewport.clientWidth * 0.85, 1);
    viewport.scrollBy({
      left: direction * amount,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  };

  searchInput.value = new URLSearchParams(window.location.search).get("q") || "";
  searchInput.addEventListener("input", applyFilters);
  page.querySelectorAll("input[name='status'], input[name='category']").forEach((input) => {
    input.addEventListener("change", applyFilters);
  });

  arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      scrollPage(arrow.dataset.booksDirection === "next" ? 1 : -1);
    });
  });
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      viewport.scrollTo({
        left: dots.length === 1 || index === 0 ? 0 : maxScroll,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
  });
  viewport.addEventListener("scroll", updateDots, { passive: true });
  window.addEventListener("resize", updateDots);
  applyFilters();
})();
