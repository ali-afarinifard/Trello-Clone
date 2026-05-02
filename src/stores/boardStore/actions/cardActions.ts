import type { SetState, GetState } from "zustand";
import type {
  ICard,
  ICreateCardPayload,
  IUpdateCardPayload,
  IBoardState,
  ID,
} from "@/types";
import { generateId, now } from "@/utils";

export interface ICardActions {
  createCard: (payload: ICreateCardPayload) => ICard;
  updateCard: (payload: IUpdateCardPayload) => void;
  moveCard: (cardId: ID, targetListId: ID, newOrder: number) => void;
  reorderCards: (listId: ID, orderedIds: ID[]) => void;
}

export const createCardActions = (
  set: SetState<IBoardState>,
  get: GetState<IBoardState>,
  persist: (state: IBoardState) => void,
): ICardActions => ({
  createCard: (payload) => {
    const existingCount = Object.values(get().cards).filter(
      (c) => c.listId === payload.listId,
    ).length;
    const card: ICard = {
      id: generateId(),
      title: payload.title,
      description: payload.description ?? "",
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
      const updated: ICard = {
        ...existing,
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
        updatedAt: now(),
      };
      const next = {
        ...state,
        cards: { ...state.cards, [payload.id]: updated },
      };
      persist(next);
      return next;
    });
  },

  moveCard: (cardId, targetListId, newOrder) => {
    set((state) => {
      const card = state.cards[cardId];
      if (!card) return state;
      const updated: ICard = {
        ...card,
        listId: targetListId,
        order: newOrder,
        updatedAt: now(),
      };
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
});
