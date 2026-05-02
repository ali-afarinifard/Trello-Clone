import type { SetState, GetState } from "zustand";
import type {
  IList,
  ICreateListPayload,
  IUpdateListPayload,
  IBoardState,
  ID,
} from "@/types";
import { generateId, now } from "@/utils";

export interface IListActions {
  createList: (payload: ICreateListPayload) => IList;
  updateList: (payload: IUpdateListPayload) => void;
  deleteList: (listId: ID) => void;
  reorderLists: (boardId: ID, orderedIds: ID[]) => void;
}

export const createListActions = (
  set: SetState<IBoardState>,
  get: GetState<IBoardState>,
  persist: (state: IBoardState) => void,
): IListActions => ({
  createList: (payload) => {
    const existingCount = Object.values(get().lists).filter(
      (l) => l.boardId === payload.boardId,
    ).length;
    const list: IList = {
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
      const updated: IList = {
        ...existing,
        ...(payload.title !== undefined && { title: payload.title }),
        updatedAt: now(),
      };
      const next = {
        ...state,
        lists: { ...state.lists, [payload.id]: updated },
      };
      persist(next);
      return next;
    });
  },

  deleteList: (listId) => {
    set((state) => {
      const cardIds = Object.keys(state.cards).filter(
        (id) => state.cards[id].listId === listId,
      );
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
});
