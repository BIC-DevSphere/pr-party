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
│   └── load-cards.js    # loads cards listed in cards/index.json
└── cards/               # contributors only add files here
   ├── index.json        # manifest of contributor and single-page files
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
6. Update `cards/index.json`:
   - Add your card file name (without spaces, e.g., `JohnDoe.html`) to `contributorCards`.
   - Add your single page file name to `singlePages` if you created one.
7. Commit, push, and open a pull request.

## Card and Page Requirements

Please see the [requirements.md](requirements.md) file for detailed technical and design guidelines to ensure your card displays correctly on the wall.

> **Do not modify** any files outside of the `cards/` directory. The loader
> script and index page should remain unchanged.

---
