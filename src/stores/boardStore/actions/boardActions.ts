import type { SetState } from "zustand";
import type {
  IBoard,
  ICreateBoardPayload,
  IUpdateBoardPayload,
  IBoardState,
  ID,
} from "@/types";
import { generateId, now } from "@/utils";

export interface IBoardActions {
  createBoard: (payload: ICreateBoardPayload) => IBoard;
  updateBoard: (payload: IUpdateBoardPayload) => void;
  deleteBoard: (boardId: ID) => void;
}

export const createBoardActions = (
  set: SetState<IBoardState>,
  persist: (state: IBoardState) => void,
): IBoardActions => ({
  createBoard: (payload) => {
    const board: IBoard = {
      id: generateId(),
      title: payload.title,
      description: payload.description ?? "",
      color: payload.color ?? "ocean",
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
      const updated: IBoard = {
        ...existing,
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
        ...(payload.color !== undefined && { color: payload.color }),
        updatedAt: now(),
      };
      const next = {
        ...state,
        boards: { ...state.boards, [payload.id]: updated },
      };
      persist(next);
      return next;
    });
  },

  deleteBoard: (boardId) => {
    set((state) => {
      const listIds = Object.keys(state.lists).filter(
        (id) => state.lists[id].boardId === boardId,
      );
      const cardIds = Object.keys(state.cards).filter(
        (id) => state.cards[id].boardId === boardId,
      );
      const newBoards = { ...state.boards };
      const newLists = { ...state.lists };
      const newCards = { ...state.cards };
      delete newBoards[boardId];
      listIds.forEach((id) => delete newLists[id]);
      cardIds.forEach((id) => delete newCards[id]);
      const next = {
        ...state,
        boards: newBoards,
        lists: newLists,
        cards: newCards,
      };
      persist(next);
      return next;
    });
  },
});
