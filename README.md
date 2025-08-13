# Siddhartha Srivastava — Personal Website

Static, multi-page portfolio site built with vanilla HTML/CSS/JS. Open `index.html` locally to view.

## Structure
- `/index.html`, `/portfolio.html`, `/blogs.html`, `/services.html`, `/about.html`, `/pricing.html`, `/contact.html`
- `/css/style.css`, `/js/script.js`
- `/data/projects.json`
- `/assets/images/` and `/assets/logos/`

## Editing content
- Projects: edit `/data/projects.json` (image paths under `/assets/images/projects/`).
- Copy: edit each page HTML directly.
- Colors/spacing/components: update CSS variables and utilities in `/css/style.css`.

## Power BI & Tableau embeds
- For a project that should embed:
  - Power BI: set `links.powerbi` to your secure embed URL (e.g., Azure AD authenticated). The modal will show the iframe.
  - Tableau: set `links.tableau` to your Tableau Public or Server embed URL.

Example projects.json entry:
```json
{
  "title": "My Dashboard",
  "slug": "my-dashboard",
  "category": ["Power BI"],
  "summary": "KPIs and trends",
  "tech": ["Power BI"],
  "image": "/assets/images/projects/my-dashboard.png",
  "links": {
    "github": "https://github.com/...",
    "powerbi": "YOUR_SECURE_EMBED_URL"
  }
}
```

## Development
- No build step. Serve locally with any static server, or open files directly. If using `file://`, paths are relative already.
- JS handles:
  - Sticky navbar + smooth scroll
  - Reveal-on-scroll animations (IntersectionObserver)
  - Lightweight carousels (logos/testimonials)
  - Portfolio filters + project modals (data from `/data/projects.json`)
  - Contact form validation -> opens mailto

## Performance & SEO
- Images use `loading="lazy"` where possible.
- Semantic HTML and accessible labels.
- OpenGraph/Twitter meta per page.
- `sitemap.xml` and `robots.txt` at root.

## Deploy
- GitHub Pages: push to a `main` branch. In repo settings > Pages, set branch to `main` and root folder. Site will be at `https://<user>.github.io/<repo>/`.
- Netlify: drag-and-drop the folder or connect the repository. Publish directory is the repo root.

## Contact
- Email: letsmailsiddhartha@gmail.com
- WhatsApp: https://wa.me/916389767109
- GitHub: https://github.com/Siddharthasrivastav
- LinkedIn: https://www.linkedin.com/in/siddhartha10102002/