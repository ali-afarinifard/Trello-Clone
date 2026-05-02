import type { SetState } from "zustand";
import type {
  ICard,
  IComment,
  IAddCommentPayload,
  IBoardState,
  ID,
} from "@/types";
import { generateId, now } from "@/utils";

export interface ICommentActions {
  addComment: (payload: IAddCommentPayload) => void;
  deleteComment: (cardId: ID, commentId: ID) => void;
}

export const createCommentActions = (
  set: SetState<IBoardState>,
  persist: (state: IBoardState) => void,
): ICommentActions => ({
  addComment: (payload) => {
    const comment: IComment = {
      id: generateId(),
      text: payload.text,
      author: payload.author ?? "You",
      createdAt: now(),
    };
    set((state) => {
      const card = state.cards[payload.cardId];
      if (!card) return state;
      const updatedCard: ICard = {
        ...card,
        comments: [...card.comments, comment],
        updatedAt: now(),
      };
      const next = {
        ...state,
        cards: { ...state.cards, [payload.cardId]: updatedCard },
      };
      persist(next);
      return next;
    });
  },

  deleteComment: (cardId, commentId) => {
    set((state) => {
      const card = state.cards[cardId];
      if (!card) return state;
      const updatedCard: ICard = {
        ...card,
        comments: card.comments.filter((c) => c.id !== commentId),
        updatedAt: now(),
      };
      const next = {
        ...state,
        cards: { ...state.cards, [cardId]: updatedCard },
      };
      persist(next);
      return next;
    });
  },
});
