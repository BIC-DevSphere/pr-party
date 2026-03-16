const repoOwner = "BIC-DevSphere";
const repoName = "pr-party";
const contributorDir = "cards/contributorCard";
const singlePageDir = "cards/singlePage";

const isGitHubHosted = window.location.hostname.includes("github.io");

async function listFiles(directory) {
  if (isGitHubHosted) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directory}`;
    const res = await fetch(url);
    if (res.ok) return res.json();
    return [];
  } else {
    try {
      const res = await fetch(directory + "/");
      if (res.ok) {
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = Array.from(doc.querySelectorAll("a"));
        return links
          .map((a) => a.getAttribute("href"))
          .filter((href) => href && href.endsWith(".html"))
          .map((href) => ({
            name: href.split("/").pop(),
            path: directory + "/" + href.split("/").pop(),
            download_url: directory + "/" + href.split("/").pop(),
          }));
      }
    } catch (e) {
      console.warn("Could not list local files automatically:", e);
    }
    return [];
  }
}

async function loadCards() {
  const container = document.getElementById("cards-container");
  const countEl = document.getElementById("card-count");
  let list = [];

  try {
    list = await listFiles(contributorDir);
  } catch (err) {
    console.error("Error listing files:", err);
  }

  let count = 0;

  for (const file of list) {
    const fileName = file.name;
    if (!fileName.endsWith(".html")) continue;

    const singlePageUrl = `${singlePageDir}/${fileName}`;
    const url =
      file.download_url || file.path || `${contributorDir}/${fileName}`;
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
    link.href = singlePageUrl;
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
