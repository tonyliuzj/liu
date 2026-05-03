# Liu.js

Static documentation site and ESM utility module for small browser JavaScript projects.

## Included Helpers

- `queryState(defaults)` for query-string backed UI state.
- `delegate(root, selector, type, handler)` for container-level DOM events.
- `latestTask(worker)` for aborting stale async work.
- `renderList(container, items, renderItem)` for simple list rendering.

## Files

- `index.html` loads the documentation shell.
- `script.js` renders the Liu.js documentation page.
- `liu.js` exports the JavaScript utility helpers documented by the site.
- `styles.css` contains the responsive layout and visual system.
- `CNAME` configures the custom domain `liu.js.org`.

## Publish With GitHub Pages

1. Push this repository to GitHub.
2. Open the repository on GitHub and go to **Settings** > **Pages**.
3. Choose **Deploy from a branch**.
4. Select `main` and choose the root folder `/`.
5. Save the Pages setting and wait for GitHub to publish the site.

Because `index.html`, `liu.js`, and `CNAME` are in the repository root, no build command is needed.
