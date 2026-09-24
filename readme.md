# Kazuki Tojo — Academic Portfolio

A framework-free personal academic website containing research publications, engineering projects, and an embedded curriculum vitae.

## Local development

Requirements: a current version of Node.js.

```sh
npm start
```

The website will be available at `http://127.0.0.1:8000`.

## Validation

```sh
npm run check
```

The check verifies local links and embedded documents, unique element IDs, page descriptions, canonical URLs, and removal of the former external stylesheet dependency.

## Structure

- `src/` — all files published to the website
- `src/styles.css` — shared visual design and responsive layout
- `src/site.js` — lazy loading for expandable document readers
- `scripts/` — dependency-free local server and site validation
- `.github/workflows/` — Azure Static Web Apps deployment to the `lively-coast-033be870f` site

Pushes to `main` are deployed through GitHub Actions to Azure Static Web Apps. Domain registration and DNS are managed separately from hosting.
