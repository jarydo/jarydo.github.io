# Portfolio Website

A classic-macOS desktop you can click around, at [jaryddiamond.com](https://jaryddiamond.com).

Built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- Figma
- Airplane Pretzels
- Love

## Running it

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run lint
npm run format   # prettier
```

Pushes to `main` deploy to GitHub Pages via `.github/workflows/main.yml`.

## How it works

- `src/pages/PersonalPage.tsx` — the desktop: icon layout and the open/focus/close
  window state machine. Windows are held back-to-front in one array, so a window's
  z-index is just its index.
- `src/content/filesystem.json` — what's on the desktop. Each file entry points at a
  markdown file in `public/files/`, fetched by `TextContent` when its window opens.
- `src/components/personal/` — the Mac chrome: menu bar, draggable/resizable windows
  with their open/close animations, the classic scrollbar, and the boot screen.
- `src/App.tsx` — routing. `/recruiter` and `/channel` redirect to the
  `work.` and `channel.` subdomains.

## TODO

- Fix mouse icons
- Add additional elements to folder header
- Open file animation with clock cursor
- Add option to change icons based on mac generation
- Add references section
- https://playhtml.fun/
