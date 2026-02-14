# Trello Clone

A professional Trello-like project management app built with modern web technologies.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Framework |
| **TypeScript** | Type safety |
| **Zustand** | State management |
| **@dnd-kit** | Drag & drop |
| **SCSS Modules** | Styling |
| **localStorage** | Data persistence |

## Features

- ✅ **Boards** — Create, view, and delete boards with color themes
- ✅ **Lists** — Create, rename, delete lists within a board
- ✅ **Cards** — Create, edit titles and descriptions
- ✅ **Drag & Drop** — Reorder lists and move cards between lists
- ✅ **Comments** — Add/delete comments on cards via modal
- ✅ **Persistence** — All data saved to localStorage
- ✅ **Responsive** — Works on mobile and desktop

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Boards list (home)
│   └── board/[id]/
│       └── page.tsx        # Single board view
├── components/
│   ├── ui/                 # Reusable base components
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── board/              # Board-specific components
│   │   ├── BoardView.tsx   # Main board canvas
│   │   ├── BoardCard.tsx   # Board preview card
│   │   └── CreateBoardModal.tsx
│   ├── list/
│   │   └── ListColumn.tsx  # List with sortable cards
│   ├── card/
│   │   ├── CardItem.tsx    # Draggable card
│   │   └── CardDetailModal.tsx
│   └── layout/
│       └── Navbar.tsx
├── hooks/                  # Custom hooks
│   ├── useBoard.ts         # Board derived state
│   ├── useDragAndDrop.ts   # All DnD logic
│   ├── useModal.ts         # Modal state management
│   └── useInlineEdit.ts    # Inline text editing
├── stores/
│   └── boardStore.ts       # Zustand store (single source of truth)
├── services/
│   └── storageService.ts   # localStorage abstraction
├── types/
│   └── index.ts            # All TypeScript interfaces
├── utils/
│   └── index.ts            # Pure utility functions
└── styles/
    ├── _variables.scss     # Design tokens
    ├── _mixins.scss        # Reusable patterns
    ├── _reset.scss         # CSS reset
    └── globals.scss        # Global styles
```

## Architecture Highlights

### State Management
Zustand store with **normalized state** (Records instead of arrays) for O(1) lookups. Full localStorage persistence on every state change.

### Drag & Drop
@dnd-kit with custom `useDragAndDrop` hook. Supports:
- Card reorder within list
- Card move between lists  
- List reorder on board

### SOLID Principles
- **S** — Each component has one responsibility
- **O** — Extended via props/variants, not modification
- **L** — UI components are composable and substitutable
- **I** — Small, focused TypeScript interfaces
- **D** — Components depend on abstractions (hooks/store), not implementations
