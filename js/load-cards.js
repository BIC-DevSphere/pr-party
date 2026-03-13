// this script fetches all HTML files in the cards directory and injects them
// into the page inside a wrapper with class "card".

const repoOwner = "devsphere";
const repoName = "pr-party";
const dir = "cards";

async function listCardFiles() {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${dir}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("could not list cards");
  return res.json();
}

async function loadCards() {
  const container = document.getElementById("cards-container");
  const countEl = document.getElementById("card-count");
  let files;
  try {
    files = await listCardFiles();
  } catch (err) {
    console.warn(
      "GitHub API failed, falling back to local directory listing",
      err,
    );
    files = await localFallbackList();
  }

  let count = 0;
  for (const file of files) {
    if (!file.name.endsWith(".html")) continue;
    const url = file.download_url || file.path || `cards/${file.name}`;
    const html = await fetch(url)
      .then((r) => r.text())
      .catch(() => "");
    if (!html) continue;
    const link = document.createElement("a");
    link.className = "card fade-in";
    link.href = `cards/single/${file.name}`;
    link.innerHTML = html;
    // stagger the fade-in animation
    link.style.animationDelay = `${count * 80}ms`;
    container.appendChild(link);
    count++;
    if (countEl) countEl.textContent = count;
  }
}

async function localFallbackList() {
  const names = [
    "alice.html",
    "bob.html",
    "carol.html",
    "dave.html",
    "eva.html",
    "felix.html",
    "grace.html",
  ];
  return names.map((name) => ({ name, download_url: `cards/test/${name}` }));
}

// simple CSS fade animation + link-card reset
const style = document.createElement("style");
style.textContent = `
  .fade-in { opacity: 0; animation: fade 0.5s ease forwards; }
  @keyframes fade { to { opacity: 1; } }
  a.card { display: block; text-decoration: none; color: inherit; cursor: pointer; }
  a.card:hover { text-decoration: none; }
`;
document.head.appendChild(style);

loadCards().catch(console.error);
