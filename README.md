## Hosted Github Page Link:
# https://BIC-DevSphere.github.io/pr-party

# DevSphere PR Party Contributor Wall

This repository is the foundation for the **DevSphere "PR Party" workshop**.
Participants will fork this repo, add a single HTML file to the `cards/` directory,
and open a pull request. After merging, the wall located at `index.html` will
automatically display all contributions.

## Repository structure

```
/ (root)
├── index.html           # static page hosting the wall
├── css/
│   └── style.css        # global grid + card styling
├── js/
│   └── load-cards.js    # fetches card files from GitHub and injects them
└── cards/               # contributors only add files here
    ├── templateCard.html # template for the card display
    ├── templateSinglePage.html # template for the detail page
    └── contributorCard/ # put your card HTML here
        └── <yourname>.html
```

## Participant steps

1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Create a new branch.
4. Add your card:
   - You can copy `cards/templateCard.html` to `cards/contributorCard/<yourname>.html` and edit it.
   - Or, you can create your own from scratch.
5. (Optional) Create a detail page:
   - Copy `cards/templateSinglePage.html` to `cards/singlePage/<yourname>.html` and customize.
6. Commit, push, and open a pull request.

## Card Requirements

To keep the wall looking consistent and professional, please follow these guidelines:

- **Dimensions**: Cards should be approximately **360px wide**. The height is flexible but keep it reasonable (around **400px to 600px**).
- **Colors**: Use **light/neutral background colors**. Avoid dark or extremely vibrant "dark mode" styles as they may clash with the wall's aesthetic.
- **Self-Contained**: Keep your CSS inside a `<style>` tag within your HTML file.
- **Resources**: If you use an avatar, place it in the `avatars/` directory and reference it.

> **Do not modify** any files outside of the `cards/` directory. The loader
> script and index page should remain unchanged.

---
