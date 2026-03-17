const contributorDir = "cards/contributorCard/";
const singlePageDir = "cards/singlePage/";
const manifestPath = "cards/index.json";

async function loadManifest() {
  const response = await fetch(manifestPath, { cache: "no-store" });
  if (!response.ok) return { contributorCards: [], singlePages: [] };

  const data = await response.json().catch(() => ({}));

  const contributorCards = Array.isArray(data.contributorCards)
    ? data.contributorCards
    : [];
  const singlePages = Array.isArray(data.singlePages) ? data.singlePages : [];

  return {
    contributorCards: [...new Set(contributorCards)],
    singlePages: [...new Set(singlePages)],
  };
}

async function loadCards() {
  const container = document.getElementById("cards-container");
  const countEl = document.getElementById("card-count");
  let files = [];
  let singlePageFiles = [];

  try {
    const manifest = await loadManifest();
    files = manifest.contributorCards;
    singlePageFiles = manifest.singlePages;
  } catch (err) {}

  const singlePageSet = new Set(singlePageFiles);

  let count = 0;

  for (const fileName of files) {
    const singlePageUrl = `${singlePageDir}${fileName}`;
    const url = `${contributorDir}${fileName}`;
    const html = await fetch(url)
      .then((r) => r.text())
      .catch(() => "");
    if (!html) continue;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const styles = Array.from(doc.querySelectorAll("style"))
      .map((s) => s.textContent.replace(/body\s*{[^}]+}/gi, ""))
      .join("\n");

    const cardEl = doc.querySelector(".card");
    const content = cardEl ? cardEl.innerHTML : doc.body.innerHTML;

    const link = document.createElement("a");
    link.className = "card fade-in";
    link.href = singlePageSet.has(fileName) ? singlePageUrl : "#";
    link.style.width = "360px";
    link.style.overflow = "hidden";
    link.style.display = "block";
    link.innerHTML = `<style>${styles}</style>` + content;

    const profileLink = link.querySelector(".profile-link");
    if (profileLink) {
      profileLink.style.pointerEvents = "none";
    }

    link.style.animationDelay = `${count * 80}ms`;
    container.appendChild(link);
    count++;
    if (countEl) countEl.textContent = count;
  }
}

const style = document.createElement("style");
style.textContent = `
  .fade-in { opacity: 0; animation: fade 0.5s ease forwards; }
  @keyframes fade { to { opacity: 1; } }
  a.card { display: block; text-decoration: none; color: inherit; cursor: pointer; }
  a.card:hover { text-decoration: none; }
  a.card:hover .profile-link { text-decoration: underline; }
`;
document.head.appendChild(style);

loadCards().catch(console.error);
