import type { GetState } from "zustand";
import type { IBoard, IList, ICard, IBoardState, ID } from "@/types";
import { sortByOrder } from "@/utils";

export interface ISelectors {
  getBoardLists: (boardId: ID) => IList[];
  getListCards: (listId: ID) => ICard[];
  getCard: (cardId: ID) => ICard | undefined;
  getBoard: (boardId: ID) => IBoard | undefined;
  getAllBoards: () => IBoard[];
}

export const createSelectors = (get: GetState<IBoardState>): ISelectors => ({
  getBoardLists: (boardId) =>
    sortByOrder(
      Object.values(get().lists).filter((l) => l.boardId === boardId),
    ),

  getListCards: (listId) =>
    sortByOrder(Object.values(get().cards).filter((c) => c.listId === listId)),

  getCard: (cardId) => get().cards[cardId],
  getBoard: (boardId) => get().boards[boardId],
  getAllBoards: () =>
    Object.values(get().boards).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ),
});
