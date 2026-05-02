import type { IBoardState } from "@/types";

const SEED = {
  boardId: "seed-board-0001",
  list1Id: "seed-list-0001",
  list2Id: "seed-list-0002",
  list3Id: "seed-list-0003",
  card1Id: "seed-card-0001",
  card2Id: "seed-card-0002",
  card3Id: "seed-card-0003",
  cmnt1Id: "seed-cmnt-0001",
  seedTs: "2025-01-01T00:00:00.000Z",
} as const;

export const getSeedState = (): IBoardState => ({
  boards: {
    [SEED.boardId]: {
      id: SEED.boardId,
      title: "My First Board",
      description: "Welcome to Trello Clone!",
      color: "ocean",
      createdAt: SEED.seedTs,
      updatedAt: SEED.seedTs,
    },
  },
  lists: {
    [SEED.list1Id]: {
      id: SEED.list1Id,
      title: "To Do",
      boardId: SEED.boardId,
      order: 0,
      createdAt: SEED.seedTs,
      updatedAt: SEED.seedTs,
    },
    [SEED.list2Id]: {
      id: SEED.list2Id,
      title: "In Progress",
      boardId: SEED.boardId,
      order: 1,
      createdAt: SEED.seedTs,
      updatedAt: SEED.seedTs,
    },
    [SEED.list3Id]: {
      id: SEED.list3Id,
      title: "Done",
      boardId: SEED.boardId,
      order: 2,
      createdAt: SEED.seedTs,
      updatedAt: SEED.seedTs,
    },
  },
  cards: {
    [SEED.card1Id]: {
      id: SEED.card1Id,
      title: "Set up project structure",
      description:
        "Initialize the Next.js project with TypeScript, Zustand, and SCSS.",
      listId: SEED.list1Id,
      boardId: SEED.boardId,
      order: 0,
      comments: [],
      createdAt: SEED.seedTs,
      updatedAt: SEED.seedTs,
    },
    [SEED.card2Id]: {
      id: SEED.card2Id,
      title: "Implement drag & drop",
      description: "Use @dnd-kit.",
      listId: SEED.list2Id,
      boardId: SEED.boardId,
      order: 0,
      comments: [
        {
          id: SEED.cmnt1Id,
          text: "looks great!",
          author: "Developer",
          createdAt: SEED.seedTs,
        },
      ],
      createdAt: SEED.seedTs,
      updatedAt: SEED.seedTs,
    },
    [SEED.card3Id]: {
      id: SEED.card3Id,
      title: "Design SCSS architecture",
      description:
        "Set up variables, mixins, and partials for consistent styling.",
      listId: SEED.list3Id,
      boardId: SEED.boardId,
      order: 0,
      comments: [],
      createdAt: SEED.seedTs,
      updatedAt: SEED.seedTs,
    },
  },
});
