# Design Block Docs

Static documentation page for liu.js open source design blocks. The page opens with live examples, then provides implementation snippets.

## Documented Blocks

- `WindowIframe` React component for `src/pages/index.js`.
- Status and monitor `WindowIframe` usage sections.
- Plain JavaScript terminal scripts to paste before `</body>`.
- Live preview of the iframe window and terminal behaviors.
- Contact link to `https://tony-liu.com`.

## Files

- `index.html` stores the source snippets as hidden raw text and loads the docs shell.
- `script.js` renders the documentation UI and code-copy buttons.
- `styles.css` contains the responsive documentation layout.
- `CNAME` configures the custom domain `liu.js.org`.

## Publish With GitHub Pages

1. Push this repository to GitHub.
2. Open the repository on GitHub and go to **Settings** > **Pages**.
3. Choose **Deploy from a branch**.
4. Select `main` and choose the root folder `/`.
5. Save the Pages setting and wait for GitHub to publish the site.

No build command is needed.
