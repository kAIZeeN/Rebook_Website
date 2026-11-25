(() => {
  const section = document.querySelector(".acquisitions");
  const viewport = section?.querySelector(".carousel-track");
  const previous = section?.querySelector(".carousel-arrow[aria-label='Previous books']");
  const next = section?.querySelector(".carousel-arrow[aria-label='Next books']");
  const dots = [...(section?.querySelectorAll(".carousel-dots .dot") || [])];

  if (!viewport || !previous || !next || dots.length === 0) return;

  let activeIndex = 0;
  let updateFrame = 0;

  const scrollToIndex = (index) => {
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const target = dots.length === 1 ? 0 : (maxScroll * index) / (dots.length - 1);
    viewport.scrollTo({
      left: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  };

  const setActiveDot = (index) => {
    activeIndex = index;
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle("active", isActive);
      if (isActive) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  const syncActiveDot = () => {
    cancelAnimationFrame(updateFrame);
    updateFrame = requestAnimationFrame(() => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      const progress = maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0;
      setActiveDot(Math.round(progress * (dots.length - 1)));
    });
  };

  previous.addEventListener("click", () => {
    const index = activeIndex === 0 ? dots.length - 1 : activeIndex - 1;
    setActiveDot(index);
    scrollToIndex(index);
  });

  next.addEventListener("click", () => {
    const index = (activeIndex + 1) % dots.length;
    setActiveDot(index);
    scrollToIndex(index);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveDot(index);
      scrollToIndex(index);
    });
  });

  viewport.addEventListener("scroll", syncActiveDot, { passive: true });
  window.addEventListener("resize", () => scrollToIndex(activeIndex));
})();
