# Mini Research

A static, independent collection of research, small websites, and digital experiments.

## Research notes

- [Beyond the Hive](research/hive-alternatives/) — five non-insect rethemes, 25 illustrated piece concepts and an untested design brief for a 0.8 mm nozzle. Authored directly in HTML; no renderer or print files.

- [Free compute for a personal, agentic small language model](research/gpu-credits/) — verified credit offers and a deployment plan for devices below 8 GB RAM.
- [Accounts and access checklist](research/gpu-credits/accounts.html) — signup links, training-environment authentication and private-data handoff steps.

## Preview

Run `python3 -m http.server 8000` from the repository root and visit `http://localhost:8000`. No build or dependency installation is needed. Google Fonts are optional; local font fallbacks work offline.

## Publish

Push to `main`. `.github/workflows/pages.yml` assembles only `index.html`, `assets/`, and `research/`, then deploys to GitHub Pages. Repository Pages source must be **GitHub Actions**, and the `github-pages` environment must permit `main`.

Public URL: https://x-does.github.io/mini_research/

## Add an exploration

1. Create `<slug>/index.html`, with a page title, description, semantic structure, and relative asset/navigation paths.
2. Add an `article.project-card` inside `#results` in `index.html`. Give it a unique ID, useful `data-search` keywords, and a real link. The HTML is the catalog: content works without JavaScript.
3. Update the exploration count. Add topic links only when they lead to real content. Topic nodes are not projects and do not increase the count.
4. Adapt `.feature-layout` for the growing collection. Update the labelled `nodes` and `links` in `assets/graph.js`, and add an ordinary link in `.connection-links`. Unlabelled satellite dots are illustrative, not catalog entries. Keep the graph and actual destinations in sync.
5. Add the new public folder to the workflow's `cp -R` command.
6. Check `node --check assets/app.js`, search/clear/empty states, local links and fragments, keyboard focus, no-JavaScript discovery, and phone/desktop layouts. Check root and repository-prefix hosting.

## Structure

- `index.html`: front page, project metadata, and linked topic map
- `assets/style.css`: shared responsive design and reading styles
- `assets/app.js`: progressive search enhancement
- `assets/modern.css`: mobile-first violet theme, graph layout, and shared light/dark surfaces
- `assets/theme.js`: system/light/dark preference, saved locally when storage is available
- `assets/graph.js`: dependency-free perspective projection of a small 3D network into SVG
- `research/index.html`: design rationale, implementation notes, references
- `.github/workflows/pages.yml`: public-file deployment

The first field note is design rationale, not an empirical study. Shop prototypes need appropriate external services for real payments or private customer data.

## Connected graph and themes

The full-size, borderless hero graph uses fixed three-dimensional coordinates, perspective projection, and continuous time-based `requestAnimationFrame` rotation. Desktop mouse position and phone tilt influence the orbit with smooth interpolation. Phones calibrate tilt to their initial position; browsers requiring sensor permission show an **Enable tilt** button. Denied or unavailable sensors leave automatic motion working. No WebGL library, API, backend, or build step is required. The scene is decorative; stationary topic links below it support touch, keyboards, and no-JavaScript browsing. It pauses offscreen and in background tabs. Reduced motion softens speed and input travel; a manual pause control remains available.

The header cycles **system → dark → light → system**. The preference applies to the landing page and field note and is saved only in this browser. Blocked storage does not prevent switching themes. With JavaScript disabled, the system color scheme still applies.

## Licensing

No project license has been chosen. Choose one before inviting reuse. Instrument Serif and DM Sans have separate font licenses.

## Research page publishing

GPU research is served at `research/gpu-credits/index.html`, with the account guide at `accounts.html`. The homepage card, search topics, and graph connect it to the collection. Existing Pages deployment already copies the full `research/` tree. Markdown remains the editable source; after changing it, run `python3 tools/render-gpu-research.py` (requires Python Markdown) and commit the generated HTML. GitHub Pages serves the HTML directly; no runtime Markdown conversion or build dependency is required.

The Hive design study lives at `research/hive-printable/`. It provides fifteen original single-color insect relief STL prototypes, an interactive mesh inspector, source research and a universal sloped stacking cavity. Regenerate its STL files, simplified preview meshes, validation report and ZIP archive with `python3 research/hive-printable/generate.py` (Python standard library only). Read `research/hive-printable/PRINTING.md` before printing; physical printability and fit have not been tested. The page is authored directly in HTML and is covered by the recursive `research/` deployment.
