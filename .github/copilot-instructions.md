# Workspace Instructions for Canny Tech Support

This workspace is a small static marketing website built with plain HTML, CSS, and vanilla JavaScript.

## Project overview

- Root files:
  - `index.html` — main single-page landing page
  - `css/main.css` — site styling, dark neon theme, responsive layout
  - `js/main.js` — menu toggle, form submission, fade-in animations
- There is no build system, no package manager, and no backend code in this repo.
- The contact form posts to Formspree; do not replace the action URL unless the user asks explicitly.
- The site is intended to be served as static files and previewed in a browser or a simple local server.

## Conventions

- Keep the HTML semantic and accessible.
  - Preserve the anchor navigation, `aria-labels`, and responsive mobile drawer pattern.
  - Use headings and section landmarks consistently.
- Keep the CSS theme consistent with the existing dark neon palette and glassmorphism styling.
  - Prefer CSS variables defined in `css/main.css`.
  - Maintain responsive spacing and mobile-first layout.
- Keep JavaScript simple and DOM-focused.
  - Avoid adding frameworks or build tooling.
  - `js/main.js` should continue to use vanilla DOM APIs for menu behavior and form submission.
- Keep external dependencies minimal.
  - The page already loads Google fonts and uses an external Formspree endpoint.
  - Do not add node modules, bundlers, or large third-party libraries without a clear need.

## Typical tasks

Use these instructions for:
- editing page content or marketing copy
- improving mobile responsiveness and accessibility
- refining the hero, services, AI services, about, and contact sections
- correcting UI interactions in `js/main.js`
- optimizing CSS and layout in `css/main.css`
- fixing form behavior or success/error feedback

## Testing guidance

- Preview changes in a browser by opening `index.html` or using a local static server such as VS Code Live Server.
- Check mobile layout and the hamburger menu on narrow widths.
- Validate that the contact form still submits correctly and that success/error states display.

## When not to do this

- Do not invent a backend, API server, or database for this project.
- Do not assume the site needs a JavaScript framework.
- Do not add build tooling unless the user explicitly asks for a migration.

## Example prompts

- "Improve the accessibility of the navigation menu and mobile drawer in this landing page."
- "Refactor `js/main.js` to reduce global DOM queries and make the menu toggle more robust."
- "Update the hero and AI services copy to make the value proposition clearer."
- "Make the contact form validation and success/error messaging more reliable."
