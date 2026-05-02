# Trello Clone

A professional Trello-like project management app built with modern web technologies.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Zustand | State management |
| @dnd-kit | Drag & drop |
| SCSS Modules | Styling |
| Lucide React | Icons |
| localStorage | Data persistence |

---

## Features

- ✅ **Boards** — Create, view, and delete boards with color themes
- ✅ **Lists** — Create, rename, delete lists within a board
- ✅ **Cards** — Create, edit titles and descriptions
- ✅ **Drag & Drop** — Reorder lists and move cards between lists
- ✅ **Inline Editing** — Click-to-edit board titles, list titles, and card titles
- ✅ **Comments** — Add/delete comments on cards via modal
- ✅ **Persistence** — All data saved to localStorage
- ✅ **Responsive** — Works on mobile and desktop

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development
npm run dev

# Open http://localhost:3000
```

`ui/` components use a **folder-per-component** pattern (component + styles + barrel export). Other components colocate `.tsx` and `.module.scss` in their category folder.

---

## Architecture

### Normalized State

```ts
// No .find() loops — direct access
const board = state.boards[boardId];
const card  = state.cards[cardId];
```

Mutations persist to localStorage automatically on every state change via an internal `persist()` helper inside the store.

### SSR Hydration

Since `localStorage` is browser-only, reading it during server-side render causes React hydration mismatches. This is solved with a two-phase strategy:

```
Phase 1 — Server + Client initial render
  → Static seed state with fixed IDs (identical HTML on both sides, no mismatch)

Phase 2 — After mount (useEffect)
  → StoreHydration component loads real localStorage data into the store
```

```tsx
export function StoreHydration() {
  const hydrateFromStorage = useBoardStore((s) => s.hydrateFromStorage);
  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);
  return null;
}
```

### Drag & Drop

`useDragAndDrop` abstracts all @dnd-kit logic from the UI layer. It handles three scenarios:

- Card reorder within the same list
- Card move between different lists
- List reorder on the board canvas

Activation uses a `distance: 5px` constraint to prevent accidental drags on click.

### SCSS Architecture

Styles follow a token-first approach:

```
_variables.scss  →  design tokens (colors, spacing, typography, z-index)
_mixins.scss     →  reusable patterns (flex helpers, breakpoints, text-ellipsis)
_reset.scss      →  baseline normalization
```

`sassOptions.includePaths` in `next.config.js` allows any component to import partials without relative path traversal:

```scss
@use '@/styles/variables' as v;
@use '@/styles/mixins'   as m;
```

---

## Why Next.js 14

Next.js 14 was a deliberate choice over the latest version, based on three practical considerations:

**Stability over novelty**
Next.js 14 is battle-tested in production across thousands of projects. Its edge cases are well-documented, its bugs are patched, and its behavior is predictable. Adopting a major version the week it ships means inheriting undiscovered issues — a risk that doesn't make sense for a project where reliability matters.

**Ecosystem compatibility**
Key dependencies in this project — `@dnd-kit`, `zustand`, and the broader React ecosystem — have been validated against Next.js 14. With Next.js 16 and React 19, several libraries had not yet published stable compatibility updates at the time this project was built. Chasing the latest framework version while pinning older libraries creates a fragile dependency graph.

**The App Router is fully mature in v14**
Everything this project requires — Server Components, Client Components, dynamic routing, layout nesting, and streaming — is fully supported in Next.js 14. Version 16 offers incremental improvements, but nothing that would meaningfully change the architecture of this application.

> Choosing a technology version based on stability and ecosystem readiness — rather than release date — is standard practice in production engineering. The migration path to Next.js 16 is straightforward when the ecosystem catches up.

---

## License

MIT
