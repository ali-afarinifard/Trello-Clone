import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type {
  BoardState,
  Board,
  List,
  Card,
  Comment,
  ID,
  CreateBoardPayload,
  UpdateBoardPayload,
  CreateListPayload,
  UpdateListPayload,
  CreateCardPayload,
  UpdateCardPayload,
  AddCommentPayload,
} from '@/types';
import { generateId, now, sortByOrder } from '@/utils';
import { loadBoardState, saveBoardState } from '@/services/storageService';


const SEED = {
  boardId: 'seed-board-0001',
  list1Id: 'seed-list-0001',
  list2Id: 'seed-list-0002',
  list3Id: 'seed-list-0003',
  card1Id: 'seed-card-0001',
  card2Id: 'seed-card-0002',
  card3Id: 'seed-card-0003',
  cmnt1Id: 'seed-cmnt-0001',
  seedTs:  '2025-01-01T00:00:00.000Z',
} as const;


const getSeedState = (): BoardState => ({
  boards: {
    [SEED.boardId]: {
      id: SEED.boardId,
      title: 'My First Board',
      description: 'Welcome to Trello Clone!',
      color: 'ocean',
      createdAt: SEED.seedTs,
      updatedAt: SEED.seedTs,
    },
  },
  lists: {
    [SEED.list1Id]: { id: SEED.list1Id, title: 'To Do',       boardId: SEED.boardId, order: 0, createdAt: SEED.seedTs, updatedAt: SEED.seedTs },
    [SEED.list2Id]: { id: SEED.list2Id, title: 'In Progress', boardId: SEED.boardId, order: 1, createdAt: SEED.seedTs, updatedAt: SEED.seedTs },
    [SEED.list3Id]: { id: SEED.list3Id, title: 'Done',        boardId: SEED.boardId, order: 2, createdAt: SEED.seedTs, updatedAt: SEED.seedTs },
  },
  cards: {
    [SEED.card1Id]: {
      id: SEED.card1Id,
      title: 'Set up project structure',
      description: 'Initialize the Next.js project with TypeScript, Zustand, and SCSS.',
      listId: SEED.list1Id, boardId: SEED.boardId, order: 0, comments: [],
      createdAt: SEED.seedTs, updatedAt: SEED.seedTs,
    },
    [SEED.card2Id]: {
      id: SEED.card2Id,
      title: 'Implement drag & drop',
      description: 'Use @dnd-kit.',
      listId: SEED.list2Id, boardId: SEED.boardId, order: 0,
      comments: [{ id: SEED.cmnt1Id, text: 'looks great!', author: 'Developer', createdAt: SEED.seedTs }],
      createdAt: SEED.seedTs, updatedAt: SEED.seedTs,
    },
    [SEED.card3Id]: {
      id: SEED.card3Id,
      title: 'Design SCSS architecture',
      description: 'Set up variables, mixins, and partials for consistent styling.',
      listId: SEED.list3Id, boardId: SEED.boardId, order: 0, comments: [],
      createdAt: SEED.seedTs, updatedAt: SEED.seedTs,
    },
  },
});

interface BoardStore extends BoardState {
  hydrateFromStorage: () => void;

  // Board Actions
  createBoard: (payload: CreateBoardPayload) => Board;
  updateBoard: (payload: UpdateBoardPayload) => void;
  deleteBoard: (boardId: ID) => void;

  // List Actions
  createList: (payload: CreateListPayload) => List;
  updateList: (payload: UpdateListPayload) => void;
  deleteList: (listId: ID) => void;
  reorderLists: (boardId: ID, orderedIds: ID[]) => void;

  // Card Actions
  createCard: (payload: CreateCardPayload) => Card;
  updateCard: (payload: UpdateCardPayload) => void;
  moveCard: (cardId: ID, targetListId: ID, newOrder: number) => void;
  reorderCards: (listId: ID, orderedIds: ID[]) => void;

  // Comment Actions
  addComment: (payload: AddCommentPayload) => void;
  deleteComment: (cardId: ID, commentId: ID) => void;

  // Selectors
  getBoardLists: (boardId: ID) => List[];
  getListCards: (listId: ID) => Card[];
  getCard: (cardId: ID) => Card | undefined;
  getBoard: (boardId: ID) => Board | undefined;
  getAllBoards: () => Board[];
}

export const useBoardStore = create<BoardStore>()(
  subscribeWithSelector((set, get) => {
    const persist = (state: BoardState) => {
      saveBoardState({
        boards: state.boards,
        lists: state.lists,
        cards: state.cards,
      });
    };

    return {
      ...getSeedState(),

      hydrateFromStorage: () => {
        const persisted = loadBoardState();
        if (persisted) {
          set({ boards: persisted.boards, lists: persisted.lists, cards: persisted.cards });
        }
      },

      // BOARD ACTIONS
      createBoard: (payload) => {
        const board: Board = {
          id: generateId(),
          title: payload.title,
          description: payload.description ?? '',
          color: payload.color ?? 'ocean',
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => {
          const next = { ...state, boards: { ...state.boards, [board.id]: board } };
          persist(next);
          return next;
        });
        return board;
      },

      updateBoard: (payload) => {
        set((state) => {
          const existing = state.boards[payload.id];
          if (!existing) return state;
          const updated: Board = {
            ...existing,
            ...(payload.title !== undefined && { title: payload.title }),
            ...(payload.description !== undefined && { description: payload.description }),
            ...(payload.color !== undefined && { color: payload.color }),
            updatedAt: now(),
          };
          const next = { ...state, boards: { ...state.boards, [payload.id]: updated } };
          persist(next);
          return next;
        });
      },

      deleteBoard: (boardId) => {
        set((state) => {
          const listIds = Object.keys(state.lists).filter((id) => state.lists[id].boardId === boardId);
          const cardIds = Object.keys(state.cards).filter((id) => state.cards[id].boardId === boardId);
          const newBoards = { ...state.boards };
          const newLists  = { ...state.lists };
          const newCards  = { ...state.cards };
          delete newBoards[boardId];
          listIds.forEach((id) => delete newLists[id]);
          cardIds.forEach((id) => delete newCards[id]);
          const next = { ...state, boards: newBoards, lists: newLists, cards: newCards };
          persist(next);
          return next;
        });
      },

      // LIST ACTIONS
      createList: (payload) => {
        const existingCount = Object.values(get().lists).filter(
          (l) => l.boardId === payload.boardId
        ).length;
        const list: List = {
          id: generateId(),
          title: payload.title,
          boardId: payload.boardId,
          order: existingCount,
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => {
          const next = { ...state, lists: { ...state.lists, [list.id]: list } };
          persist(next);
          return next;
        });
        return list;
      },

      updateList: (payload) => {
        set((state) => {
          const existing = state.lists[payload.id];
          if (!existing) return state;
          const updated: List = {
            ...existing,
            ...(payload.title !== undefined && { title: payload.title }),
            updatedAt: now(),
          };
          const next = { ...state, lists: { ...state.lists, [payload.id]: updated } };
          persist(next);
          return next;
        });
      },

      deleteList: (listId) => {
        set((state) => {
          const cardIds = Object.keys(state.cards).filter((id) => state.cards[id].listId === listId);
          const newLists = { ...state.lists };
          const newCards = { ...state.cards };
          delete newLists[listId];
          cardIds.forEach((id) => delete newCards[id]);
          const next = { ...state, lists: newLists, cards: newCards };
          persist(next);
          return next;
        });
      },

      reorderLists: (boardId, orderedIds) => {
        set((state) => {
          const newLists = { ...state.lists };
          orderedIds.forEach((id, index) => {
            if (newLists[id]) {
              newLists[id] = { ...newLists[id], order: index, updatedAt: now() };
            }
          });
          const next = { ...state, lists: newLists };
          persist(next);
          return next;
        });
      },

      // CARD ACTIONS
      createCard: (payload) => {
        const existingCount = Object.values(get().cards).filter(
          (c) => c.listId === payload.listId
        ).length;
        const card: Card = {
          id: generateId(),
          title: payload.title,
          description: payload.description ?? '',
          listId: payload.listId,
          boardId: payload.boardId,
          order: existingCount,
          comments: [],
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => {
          const next = { ...state, cards: { ...state.cards, [card.id]: card } };
          persist(next);
          return next;
        });
        return card;
      },

      updateCard: (payload) => {
        set((state) => {
          const existing = state.cards[payload.id];
          if (!existing) return state;
          const updated: Card = {
            ...existing,
            ...(payload.title !== undefined && { title: payload.title }),
            ...(payload.description !== undefined && { description: payload.description }),
            updatedAt: now(),
          };
          const next = { ...state, cards: { ...state.cards, [payload.id]: updated } };
          persist(next);
          return next;
        });
      },

      moveCard: (cardId, targetListId, newOrder) => {
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;
          const updated: Card = { ...card, listId: targetListId, order: newOrder, updatedAt: now() };
          const next = { ...state, cards: { ...state.cards, [cardId]: updated } };
          persist(next);
          return next;
        });
      },

      reorderCards: (listId, orderedIds) => {
        set((state) => {
          const newCards = { ...state.cards };
          orderedIds.forEach((id, index) => {
            if (newCards[id] && newCards[id].listId === listId) {
              newCards[id] = { ...newCards[id], order: index, updatedAt: now() };
            }
          });
          const next = { ...state, cards: newCards };
          persist(next);
          return next;
        });
      },

      // COMMENT ACTIONS
      addComment: (payload) => {
        const comment: Comment = {
          id: generateId(),
          text: payload.text,
          author: payload.author ?? 'You',
          createdAt: now(),
        };
        set((state) => {
          const card = state.cards[payload.cardId];
          if (!card) return state;
          const updatedCard: Card = {
            ...card,
            comments: [...card.comments, comment],
            updatedAt: now(),
          };
          const next = { ...state, cards: { ...state.cards, [payload.cardId]: updatedCard } };
          persist(next);
          return next;
        });
      },

      deleteComment: (cardId, commentId) => {
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;
          const updatedCard: Card = {
            ...card,
            comments: card.comments.filter((c) => c.id !== commentId),
            updatedAt: now(),
          };
          const next = { ...state, cards: { ...state.cards, [cardId]: updatedCard } };
          persist(next);
          return next;
        });
      },

      // SELECTORS
      getBoardLists: (boardId) =>
        sortByOrder(Object.values(get().lists).filter((l) => l.boardId === boardId)),

      getListCards: (listId) =>
        sortByOrder(Object.values(get().cards).filter((c) => c.listId === listId)),

      getCard: (cardId) => get().cards[cardId],

      getBoard: (boardId) => get().boards[boardId],

      getAllBoards: () =>
        Object.values(get().boards).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
    };
  })
);