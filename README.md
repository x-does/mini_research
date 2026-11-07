# Mini Research

A static, independent collection of research, small websites, and digital experiments.

## Research notes

- [Free compute for a personal, agentic small language model](research/gpu-credits/README.md) — verified credit offers and a deployment plan for devices below 8 GB RAM.
- [Accounts and access checklist](research/gpu-credits/ACCOUNTS.md) — signup links, training-environment authentication and private-data handoff steps.

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

The graph uses a fixed set of three-dimensional coordinates, perspective projection, and time-based `requestAnimationFrame` rotation. No WebGL library, API, backend, or build step is required. The scene is decorative; the real, stationary topic links below it support touch, keyboards, and no-JavaScript browsing. It pauses offscreen and in background tabs. Reduced motion starts it paused; the visitor can explicitly play or pause it.

The header cycles **system → dark → light → system**. The preference applies to the landing page and field note and is saved only in this browser. Blocked storage does not prevent switching themes. With JavaScript disabled, the system color scheme still applies.

## Licensing

No project license has been chosen. Choose one before inviting reuse. Instrument Serif and DM Sans have separate font licenses.
