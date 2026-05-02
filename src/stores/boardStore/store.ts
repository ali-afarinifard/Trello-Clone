import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type { IBoardState } from "@/types";
import { loadBoardState, saveBoardState } from "@/services/storageService";
import { logger } from "@/utils/index";
import { getSeedState } from "./seed";
import { createBoardActions, IBoardActions } from "./actions/boardActions";
import { createListActions, IListActions } from "./actions/listActions";
import { createCardActions, ICardActions } from "./actions/cardActions";
import {
  createCommentActions,
  ICommentActions,
} from "./actions/commentActions";
import { createSelectors, ISelectors } from "./selectors";

interface IBoardStore
  extends
    IBoardState,
    IBoardActions,
    IListActions,
    ICardActions,
    ICommentActions,
    ISelectors {
  hydrateFromStorage: () => void;
}

export const useBoardStore = create<IBoardStore>()(
  subscribeWithSelector((set, get) => {
    const persist = (state: IBoardState) => {
      const saved = saveBoardState({
        boards: state.boards,
        lists: state.lists,
        cards: state.cards,
      });
      if (!saved) {
        logger.warn("[BoardStore] Failed to persist state to localStorage.");
      }
    };

    return {
      ...getSeedState(),

      hydrateFromStorage: () => {
        const persisted = loadBoardState();
        if (persisted) {
          set({
            boards: persisted.boards,
            lists: persisted.lists,
            cards: persisted.cards,
          });
        }
      },

      ...createBoardActions(set, persist),
      ...createListActions(set, get, persist),
      ...createCardActions(set, get, persist),
      ...createCommentActions(set, persist),
      ...createSelectors(get),
    };
  }),
);
