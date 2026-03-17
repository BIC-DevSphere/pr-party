/**
 * parallax.js
 * Multi-layer scroll parallax for the sticky hero.
 *
 * Layer depth model (scroll DOWN → positive scrollY):
 *   .hero-bg-deco   → drifts DOWN  (+y) at 12% speed — feels farther away
 *   .hero-content   → rises  UP    (-y) at 18% speed — feels closer
 *   .scroll-hint    → fades out immediately on any scroll
 *
 * The opposing directions create genuine perceived depth between
 * the background and foreground layers.
 */

(function () {
  /* ── element refs ──────────────────────────────────────── */
  const heroBg      = document.querySelector(".hero-bg-deco");
  const heroContent = document.querySelector(".hero-content");
  const scrollHint  = document.querySelector(".scroll-hint");
  const hero        = document.querySelector(".hero");

  /* ── cached measurements ───────────────────────────────── */
  let heroH = 0;
  function measure() {
    heroH = hero ? hero.offsetHeight : window.innerHeight;
  }

  /* ── main update (runs inside rAF) ─────────────────────── */
  let ticking = false;

  function update() {
    const y = window.scrollY;
    // Normalised progress 0 → 1 across the hero height
    const p = heroH > 0 ? Math.min(y / heroH, 1) : 0;

    /* Background deco — drifts DOWN (recedes into distance) */
    if (heroBg) {
      heroBg.style.transform = `translate(-50%, calc(-50% + ${y * 0.12}px))`;
    }

    /* Hero content — rises UP (comes toward the viewer) */
    if (heroContent) {
      heroContent.style.transform = `translateY(${y * -0.18}px)`;
      // Fade out — fully gone by 55% of hero height
      heroContent.style.opacity = Math.max(1 - p / 0.55, 0);
    }

    /* Scroll hint — vanishes as soon as user scrolls */
    if (scrollHint) {
      // Opacity 0.7 → 0 over the first 60px of scroll
      scrollHint.style.opacity = Math.max(0.7 - y * 0.025, 0);
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  /* ── init ──────────────────────────────────────────────── */
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { measure(); update(); });

  // Run once at load so transforms start at their correct zero position
  update();
})();
