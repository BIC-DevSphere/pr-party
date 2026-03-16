# Card and Single Page Requirements

To keep the contributor wall looking consistent and professional, please follow these guidelines when adding your contribution.

## 1. File Naming Rules

- Use your **Full Name without spaces** for all file names (e.g., `JohnDoe.html`). Use PascalCase (start each word with a capital letter).
- Your avatar should follow the same naming convention: `JohnDoe.png` or `JohnDoe.jpg`.

## 2. Card Dimensions (`cards/contributorCard/`)

- **Width**: Must be exactly **360px**.
- **Height**: Recommended between **400px and 600px**.
- **Contained**: If creating your own card from scratch, ensure it is wrapped in a div with `class="card"` or set to `width: 360px; overflow: hidden;`.

## 3. Registration

- You **must** add your filename to `cards/index.json`:
  - Add it to the `contributorCards` array if you created a card.
  - Add it to the `singlePages` array if you created a detail page.

## 4. Design & Aesthetics

- **Colors**: Use **light/neutral background colors** (e.g., `#ffffff`, `#f9f9f9`, or soft pastels). Avoid dark backgrounds or high-contrast vibrant colors that clash with the wall's grid.
- **Self-Contained**: All CSS must be inside a `<style>` tag within your HTML file.
- **Resources**: If you use an avatar, place it in the `avatars/` directory.
