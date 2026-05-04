# JeradXYZ

A static personal website and project studio for `jerad.xyz`.

The site has two layers:

- `index.html` and `styles.css` are the working prototype.
- `content/`, `media/`, `data/`, and `exports/` keep poems, writing, images, and backups organized as the site grows.

## Directory map

```text
content/
  poems/                 Markdown poem posts
  writing/               Blog posts, reflections, guides, project notes
  visuals/
    photos/              Photo note Markdown files
    illustrations/       Illustration note Markdown files
media/
  photos/                Optimized public photo files
  illustrations/         Optimized public illustration files
  raw/                   Original uploads before editing/resizing
data/                    JSON data exported from the browser studio
exports/                 One-off Markdown or JSON exports from the app
```

## Suggested naming

Use dates so files sort naturally:

```text
content/poems/2026-05-01-low-tide-notebook.md
content/writing/2026-05-01-starting-things.md
content/visuals/photos/2026-05-01-pacifica-evening.md
media/photos/2026-05-01-pacifica-evening.jpg
media/illustrations/2026-05-01-map-wrong-on-purpose.jpg
```

## Browser studio workflow

The studio in `index.html` saves drafts in this browser's local storage. Use the export buttons to download Markdown or JSON, then place those files into the matching folder above.

For a later production version, this structure can become the source for a static-site generator, a CMS, Supabase, Netlify Blobs, or another backend.
