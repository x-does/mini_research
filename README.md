# Mini Research

An open field for small websites, research notes, interface concepts, and digital experiments. A dependency-free static site for GitHub Pages.

## Preview locally

From the repository root, run `python3 -m http.server 8000`, then visit `http://localhost:8000`. No install or build step is needed. Fonts load from Google Fonts; local serif and sans-serif fallbacks work offline.

## Publish to GitHub Pages

1. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**.
2. Push this site to `main`, or run **Deploy static site to Pages** manually in Actions.
3. The workflow publishes `index.html`, `assets/`, and `research/`. For this repository the expected project URL is `https://x-does.github.io/mini_research/`.

Publication is controlled by GitHub repository settings and permissions. No deployment is performed by local file changes alone. The relative URLs support both project-subpath and root hosting.

## Add an exploration

1. Create `<slug>/index.html`. Use relative paths (`../assets/style.css` for shared styles, `../` for home). Give the page a title, description, and accessible structure.
2. Add an `<article class="project-node">` inside `#atlas` in `index.html`. Copy the existing card; set a unique ID, `data-category` (`research`, `interfaces`, or `experiments`), and `data-search` keywords. Use a real link to `<slug>/`. Metadata is stored in the HTML so links work without JavaScript.
3. Position the new node in `assets/style.css`. Add a meaningful connection to the decorative SVG, and check overlap on narrow and wide screens. All cards automatically participate in list view and search.
4. Update the published count, filter count, and initial result count in `index.html`. Remove or reposition future-direction markers as real content arrives.
5. Add the folder to the `cp -R` line in `.github/workflows/pages.yml`. Only explicitly listed folders are published.
6. Run `node --check assets/app.js`, and check local links, category/search combinations, empty-state reset, map/list state, keyboard focus, mobile layout, and no-JavaScript navigation. Also test under a repository prefix before deploying.

The first field note at `research/` documents the design rationale and references. It is not presented as an empirical user study. There is one real project; dashed atlas nodes are non-interactive future directions.

## Structure

- `index.html` — landing page and semantic project catalog
- `assets/style.css` — shared responsive styles
- `assets/app.js` — optional search, filters, and view switching
- `research/index.html` — first published field note
- `.github/workflows/pages.yml` — static deployment

## Content and licensing

No project license has been chosen yet. Choose one before inviting reuse or contributions. Google Fonts are externally hosted; Instrument Serif and DM Sans have their own font licenses. Do not publish secrets or private research in public site folders.
