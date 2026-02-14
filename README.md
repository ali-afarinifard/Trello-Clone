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

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout + StoreHydration
│   ├── page.tsx                  # Boards list (home)
│   └── board/[id]/
│       └── page.tsx              # Single board view
├── components/
│   ├── ui/                       # Reusable base components
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── board/                    # Board-specific components
│   │   ├── BoardView/            # Main board canvas with DnD
│   │   ├── BoardCard/            # Board preview card
│   │   └── CreateBoardModal/
│   ├── list/
│   │   └── ListColumn/           # List with sortable cards
│   ├── card/
│   │   ├── CardItem/             # Draggable card
│   │   └── CardDetailModal/
│   └── layout/
│       ├── Navbar/
│       └── StoreHydration/       # SSR-safe localStorage loader
├── hooks/
│   ├── useBoard.ts               # Board derived state
│   ├── useDragAndDrop.ts         # All DnD logic
│   ├── useModal.ts               # Modal state management
│   └── useInlineEdit.ts          # Inline text editing
├── stores/
│   └── boardStore.ts             # Zustand store (single source of truth)
├── services/
│   └── storageService.ts         # localStorage abstraction
├── types/
│   └── index.ts                  # All TypeScript interfaces
├── utils/
│   └── index.ts                  # Pure utility functions
└── styles/
    ├── _variables.scss           # Design tokens
    ├── _mixins.scss              # Reusable patterns
    ├── _reset.scss               # CSS reset
    └── globals.scss              # Global styles
```

Each component follows a **folder-per-component** pattern:

```
components/ui/Button/
├── Button.tsx          # Component logic
├── Button.module.scss  # Scoped styles
└── index.ts            # Re-export for clean imports
```

---

## Architecture

### Normalized State

The Zustand store uses `Record<ID, Entity>` instead of arrays, enabling O(1) lookups on every read:

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

`sassOptions.includePaths` in `next.config.ts` allows any component to import partials without relative path traversal:

```scss
@use '@/styles/variables' as v;
@use '@/styles/mixins'   as m;
```

---

## License

MIT
