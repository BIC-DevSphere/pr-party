/**
 * hero-stats.js
 * Fetches live GitHub repo stats for the hero section.
 * Uses localStorage caching (5 min TTL) to stay well within GitHub's
 * unauthenticated rate limit of 60 requests/hour.
 */

const REPO_OWNER = "BIC-DevSphere";
const REPO_NAME  = "pr-party";
const CACHE_TTL  = 5 * 60 * 1000; // 5 minutes

async function cachedFetch(url, cacheKey) {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data;
    }
  } catch (_) {}

  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });

  // If rate-limited, return null gracefully
  if (res.status === 403 || res.status === 429) return null;
  if (!res.ok) return null;

  const data = await res.json();
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
  } catch (_) {}
  return data;
}

function animateCount(el, target, duration = 1400) {
  if (!el || isNaN(target)) return;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

async function loadHeroStats() {
  const BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

  // Fire both requests in parallel — counts as 2 API calls, cached for 5 min.
  const [repoData, contribData] = await Promise.all([
    cachedFetch(BASE, `hs_repo_${REPO_OWNER}_${REPO_NAME}`),
    cachedFetch(
      `${BASE}/contributors?per_page=1&anon=1`,
      `hs_contrib_${REPO_OWNER}_${REPO_NAME}`
    ),
  ]);

  // --- Stars ---
  const starsEl = document.getElementById("stat-stars");
  if (starsEl && repoData?.stargazers_count != null) {
    animateCount(starsEl, repoData.stargazers_count);
  }

  // --- Forks ---
  const forksEl = document.getElementById("stat-forks");
  if (forksEl && repoData?.forks_count != null) {
    animateCount(forksEl, repoData.forks_count);
  }

  // --- Contributors (header link trick) ---
  // GitHub returns a Link header with last page number when per_page=1,
  // which gives total contributor count without fetching all pages.
  // We already have the raw response… but cachedFetch only stores JSON.
  // So we fetch headers separately only on cache miss by checking stored value.
  const contribCountEl = document.getElementById("stat-contributors");
  if (contribCountEl) {
    // Try to get count from the Link header via a separate uncached HEAD-style call
    const cacheKey = `hs_contrib_count_${REPO_OWNER}_${REPO_NAME}`;
    let count = null;

    try {
      const cachedCount = localStorage.getItem(cacheKey);
      if (cachedCount) {
        const { ts, data } = JSON.parse(cachedCount);
        if (Date.now() - ts < CACHE_TTL) count = data;
      }
    } catch (_) {}

    if (count === null) {
      try {
        const res = await fetch(
          `${BASE}/contributors?per_page=1&anon=1`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (res.ok) {
          const link = res.headers.get("Link") || "";
          const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
          count = match ? parseInt(match[1], 10) : (await res.json()).length;
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ ts: Date.now(), data: count })
            );
          } catch (_) {}
        }
      } catch (_) {}
    }

    if (count != null) {
      animateCount(contribCountEl, count);
      // Also update the live badge in the hero
      const badgeCount = document.getElementById("hero-badge-count");
      if (badgeCount) badgeCount.textContent = count;
    }
  }
}

// Kick off after DOM loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHeroStats);
} else {
  loadHeroStats();
}
