# DevSphere PR Party Contributor Wall

This repository is the foundation for the **DevSphere "PR Party" workshop**.
Participants will fork this repo, add a single HTML file to the `cards/` directory,
and open a pull request. After merging, the wall located at `index.html` will
automatically display all contributions.

> ⚠️ The main page has been completely revamped once again. It now uses a
> **sunrise-inspired, light-and-airy theme**: dawn gradient header with an SVG
> wave, white paper‑like cards, and subtle shadow/tilt on hover. The previous
> dark/neon designs are gone. Feel free to style your card to complement this
> bright look or go in a totally different direction.

## Repository structure

```
/ (root)
├── index.html           # static page hosting the wall
├── css/
│   └── style.css        # global grid + card styling
├── js/
│   └── load-cards.js    # fetches card files from GitHub and injects them
└── cards/               # contributors only add files here
    ├── template.html    # copy this to create your own card
    └── <yourname>.html  # your personal card file
```

## Participant steps

1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Create a new branch (GitHub may suggest one automatically).
4. Copy `cards/template.html` and rename to `cards/<yourname>.html`.
5. Edit the file with your own HTML and optional CSS.
6. Commit, push, and open a pull request against the original `main` branch.

> **Do not modify** any files outside of the `cards/` directory. The loader
> script and index page should remain unchanged to avoid merge conflicts.

## Testing locally

A simple HTTP server is enough to try the wall out:

```bash
cd path/to/repo
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Add a dummy card `cards/test.html` to see it appear.

## Deployment

You can host this repository with [GitHub Pages](https://pages.github.com/).
On the repository settings pick `main` branch as the source; the page URL will
be `https://<your-org>.github.io/pr-party/` or similar.

The JS loader uses the GitHub REST API. For public repositories no authentication
is required. If you choose to make the repo private, you will need to update the
script to use a personal access token with read access.

---

Feel free to modify the styles or add enhancements, but keep the workflow
simple for workshop participants.
