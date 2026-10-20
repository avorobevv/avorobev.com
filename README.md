# avorobev.com

Personal site. Plain HTML/CSS/JS, served by GitHub Pages at https://avorobev.com.

## Editing

| What | Where |
|---|---|
| Bio, links, headline | `index.html` |
| Listening / watching / reading shelves | `assets/js/now.js` (edit the data; the page renders it) |
| Portrait | add `assets/img/avatar.jpg` (square-ish, ~800px) — it replaces the monogram automatically |
| Colors, fonts, light/dark tokens | top of `assets/css/site.css` |

## Making updates show up right away

Pages link the CSS/JS as `site.css?v=20261020`, `now.js?v=20261020`, etc. Browsers cache those files, so
after editing `now.js`, `main.js` or `site.css`, bump the `?v=` value in every HTML file:

```bash
sed -i '' "s/?v=[0-9a-z]*\"/?v=$(date +%Y%m%d%H%M)\"/g" index.html 404.html writing/*.html writing/*/index.html music/index.html
```

## Adding a blog post

1. Copy `writing/hello-world/` to `writing/<your-slug>/` and edit its `index.html`.
2. Add a `<li class="post-row">` for it at the top of the list in `writing/index.html`.
3. Commit and push — Pages redeploys in about a minute.

## Local preview

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765. (Opening the HTML file directly won't load styles, since paths are root-relative.)
