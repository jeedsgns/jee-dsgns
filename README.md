# JEE.DSGNS — Portfolio of Jerro Magano

Black-and-chrome graphic design portfolio. Plain HTML, CSS and JavaScript, no build step, no dependencies (only Google Fonts).

## Run locally
Open `index.html` in your browser. (Internet is needed only for the Google Fonts.)

## Add your artwork
1. Copy your images into `images/portfolio/`.
2. Open `script.js` and edit the `WORKS` list at the top. Add one line per artwork:
   `{ src:"my-file.jpg", cat:"Typography", title:"Title", desc:"Short description", ratio:"4/5" }`
3. Save and refresh. Placeholders are replaced automatically; images keep their own aspect ratio.

Tips: export JPG/WebP around 1600–2400 px on the long side, under ~500 KB each, for fast loading.
The intro (`index.html`) uses `images/logo.png`. The Home hero, header and footer of `portfolio.html` use the compact two-line logo at `images/logo-compact.png` (trimmed from `JEE_DSGNS_LOGO_22.png`; only empty transparent margin was removed). The Toolkit shows software names as plain text (no logo images).

## Your photo (Home section)
Put your photograph at **`images/profile/your-photo.jpg`** — same name, JPG, portrait 4:5 (e.g. 1600 × 2000 px, under ~500 KB). That is all: the Home section shows it automatically (cropped to the frame, face-friendly top crop). Until the file exists, a framed placeholder shows the path. To use a different crop, change `object-position` on `.portrait-frame img` in `style.css`.

## Change categories
Edit the `CATEGORIES` list in `script.js`. Each work's `cat` must match a category name exactly. Filter buttons update by themselves.

## Upload to GitHub
1. Create a new public repository on github.com (e.g. `jee-dsgns-portfolio`).
2. Click **Add file → Upload files**, drag in everything inside this folder (keep the `images` folders), then **Commit changes**.

## Enable GitHub Pages
Repository **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`, **Save**. After a minute your site appears at `https://<your-username>.github.io/<repo-name>/`.

## Notes
- The contact form is a front-end demo; it says so and does not send anything. To receive messages, connect a service such as Formspree.
- Contact: Instagram [@jjerro_](https://www.instagram.com/jjerro_/) · maganojerrooo@gmail.com

## Intro / entry screen
`index.html` is now the intro: a floating 3D chrome version of your logo (traced from `JEE_DSGNS_LOGO.png`). Double-click it (tap on mobile, or Tab + Enter) to enter. The existing portfolio is unchanged and was only renamed to `portfolio.html`. To point the intro somewhere else, change `ENTER_URL` at the top of the script in `index.html`. The intro loads Three.js and GSAP from cdnjs, so it needs internet.

## Gallery, map and intro (v2)
- Works: `portfolioData.js` is the single list behind ALL WORKS and the three categories. See `HOW-TO-ADD-WORKS.md`; optional `node scan-portfolio.js` registers new images found in the category folders.
- Map: edit `LOCATIONS` in `mapData.js` to add places (SVG, no libraries).
- Intro (`index.html`): the 360° sky path is set once, at `SKY_URL` near the top of the script. Put a 2:1 equirectangular panorama (e.g. 4096 × 2048 JPG) at `images/sky/space-360.jpg` and it is used automatically when the site is served over http/https (GitHub Pages, or `python3 -m http.server`). If that file is missing — or when opened straight from disk, where browsers block WebGL from reading local images — a generated 360° space sky in the same palette is used instead. The chrome logo reflects that sky plus a few light panels, which is what makes it shiny.
- The old text loading screen was removed from `portfolio.html`, `style.css` and `script.js`.
