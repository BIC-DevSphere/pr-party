// this script fetches all HTML files in the cards directory and injects them
// into the page inside a wrapper with class "card".

const repoOwner = "DevSphere";
const repoName = "pr-party";
const dir = "cards/contributorCard";

async function listCardFiles() {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${dir}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("could not list cards");
  return res.json();
}

async function loadCards() {
  const container = document.getElementById("cards-container");
  const countEl = document.getElementById("card-count");
  let files = [];
  try {
    files = await listCardFiles();
  } catch (err) {
    console.warn(
      "GitHub API failed, falling back to local directory listing",
      err,
    );
  }

  let count = 0;

  for (const file of files) {
    if (!file.name.endsWith(".html")) continue;
    const url = file.download_url || file.path || `cards/${file.name}`;
    const html = await fetch(url)
      .then((r) => r.text())
      .catch(() => "");
    if (!html) continue;

    // Parse the fetched html to extract styles and inner elements safely
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove `body` styles as they break the main page's flex and parallax layout
    const styles = Array.from(doc.querySelectorAll("style")).map(s => 
      s.textContent.replace(/body\s*{[^}]+}/gi, "")
    ).join("\n");

    // Grab inner content of the card to avoid double wrapper if they used one
    const cardEl = doc.querySelector(".card");
    const content = cardEl ? cardEl.innerHTML : doc.body.innerHTML;

    const link = document.createElement("a");
    link.className = "card fade-in";
    link.href = `cards/single/${file.name}`;
    link.innerHTML = `<style>${styles}</style>` + content;
    // stagger the fade-in animation
    link.style.animationDelay = `${count * 80}ms`;
    container.appendChild(link);
    count++;
    if (countEl) countEl.textContent = count;
  }
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
