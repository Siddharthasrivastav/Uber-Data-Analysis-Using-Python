# Siddhartha Srivastava — Personal Website

Vanilla, production-ready static site for Data Analytics Consulting.

## Quick start
- Open `index.html` in a browser, or serve locally for best results: `python3 -m http.server` then open `http://localhost:8000`.
- All site content is in simple HTML. Projects are configured in `data/projects.json`.

## Editing projects
1. Update `data/projects.json` to add new items. Fields:
   - `title`, `slug`, `category` (array), `summary`, `tech` (array), `image`, `links` (keys: `github`, `powerbi`, `tableau`).
2. Thumbnails: put PNGs under `assets/images/projects/` and reference them in JSON.
3. Live embeds:
   - Power BI: set `links.powerbi` to a secure embed URL (app.powerbi.com). If using workspace-level permissions, prefer Publish to web (for public) or secure embed.
   - Tableau: set `links.tableau` to the Tableau Public viz URL.

The portfolio grid and homepage featured projects will auto-render from the JSON. If fetching local JSON is blocked by your browser when opening via the `file://` protocol, use a local server (`python3 -m http.server`) or the built-in fallback data in `js/script.js` will be used.

## Replacing embed URLs
- Open any project modal via the Portfolio page and ensure the iframe loads your URL. Replace the placeholder notes by setting real URLs in `data/projects.json`.

## Fonts & colors
- Colors are defined as CSS variables in `css/style.css`. Fonts (Montserrat, Inter) are loaded via Google Fonts.

## Deploy
- GitHub Pages: push this folder to a repo, enable Pages (root). Ensure links are relative.
- Netlify: drag-and-drop the folder or connect the repo; set publish directory to the repo root.

## SEO
- Each page has a unique `<title>`, meta description, canonical link, and OpenGraph/Twitter tags. `sitemap.xml` and `robots.txt` are included.

## Accessibility
- Semantic HTML, labeled form controls, sufficient color contrast (WCAG AA), focus styles, and reduced motion-friendly animations.

## Contact
- Email: letsmailsiddhartha@gmail.com
- WhatsApp: https://wa.me/916389767109
- GitHub: https://github.com/Siddharthasrivastav
- LinkedIn: https://www.linkedin.com/in/siddhartha10102002/