# Card and Single Page Requirements

To keep the contributor wall looking consistent and professional, please follow these guidelines when adding your contribution.

## 1. File Naming Rules

- Use your **Full Name without spaces** for all file names (e.g., `JohnDoe.html`). Use PascalCase (start each word with a capital letter).
- Your avatar should follow the same naming convention: `JohnDoe.png` or `JohnDoe.jpg`.

## 2. Card Dimensions (`cards/contributorCard/`)

- **Width**: Must be exactly **360px**.
- **Height**: Recommended between **400px and 600px**.
- See Step - 5 below.

## 3. Registration

- You **must** add your filename to `cards/index.json`:
  - Add it to the `contributorCards` array if you created a card.
  - Add it to the `singlePages` array if you created a detail page.

## 4. Design & Aesthetics

- **Colors**: Use **light/neutral background colors** (e.g., `#ffffff`, `#f9f9f9`, or soft pastels). Avoid dark backgrounds or high-contrast vibrant colors that clash with the wall's grid.
- **Self-Contained**: All CSS must be inside a `<style>` tag within your HTML file.
- **Resources**: If you use an avatar, place it in the `avatars/` directory.

## 5. CSS Class Naming (Required for Custom Styling)

- If you change colors, spacing, typography, or any other styling, **do not reuse generic shared class names** like `.card`, `.card-top`, `.quote`, etc.
- Rename the class in both places:
  - In your CSS selectors inside `<style>`
  - In the matching HTML elements using those classes
- Use a contributor-specific suffix/prefix so your styles stay isolated.
  - Example: change `.card` to `.card-fullname` (such as `.card-aaditya-thapa`), and update `<div class="card">` to `<div class="card-aaditya-thapa">`.
