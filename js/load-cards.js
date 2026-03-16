const repoOwner = "BIC-DevSphere";
const repoName = "pr-party";
const dir = "cards/contributorCard";

async function listFiles(directory) {
  // First try local index.json
  try {
    const localRes = await fetch(`${directory}/index.json`);
    if (localRes.ok) {
      const names = await localRes.json();
      return names.map(name => ({
        name,
        path: `${directory}/${name}`,
        download_url: `${directory}/${name}`
      }));
    }
  } catch (e) {
    // Fallback to GitHub API
  }

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directory}`;
  const res = await fetch(url);
  if (res.ok) return res.json();
  return [];
}

async function loadCards() {
  const container = document.getElementById("cards-container");
  const countEl = document.getElementById("card-count");
  let files = [];
  let singlePageFiles = [];

  try {
    files = await listFiles(dir);
    singlePageFiles = await listFiles("cards/singlePage");
  } catch (err) {}

  let count = 0;

  for (const file of files) {
    if (!file.name.endsWith(".html") || file.name === "index.html") continue;

    // Associated single page in cards/singlePage
    const singlePageFile = singlePageFiles.find(sf => sf.name === file.name);
    const singlePageUrl = singlePageFile ? `cards/singlePage/${file.name}` : null;
    
    const url =
      file.download_url || file.path || `cards/contributorCard/${file.name}`;
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
    // Link to single page if it exists
    if (singlePageUrl) {
      link.href = singlePageUrl;
    } else {
      link.style.cursor = "default";
    }
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
