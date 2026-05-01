import { useState, useCallback } from "react";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useBoardStore } from "@/stores/boardStore";
import type { ID } from "@/types";

type DragType = "CARD" | "LIST" | null;

interface IActiveDragState {
  id: ID;
  type: DragType;
}

interface IUseDragAndDropReturn {
  activeDrag: IActiveDragState | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
}

export function useDragAndDrop(boardId: ID): IUseDragAndDropReturn {
  const [activeDrag, setActiveDrag] = useState<IActiveDragState | null>(null);

  const getBoardLists = useBoardStore((state) => state.getBoardLists);
  const getListCards = useBoardStore((state) => state.getListCards);
  const reorderLists = useBoardStore((state) => state.reorderLists);
  const reorderCards = useBoardStore((state) => state.reorderCards);
  const moveCard = useBoardStore((state) => state.moveCard);
  const cards = useBoardStore((state) => state.cards);
  const lists = useBoardStore((state) => state.lists);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const activeId = event.active.id as ID;
      const type: DragType = activeId in cards ? "CARD" : "LIST";
      setActiveDrag({ id: activeId, type });
    },
    [cards],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as ID;
      const overId = over.id as ID;

      if (activeId === overId) return;

      const isActiveCard = activeId in cards;
      if (!isActiveCard) return;

      const activeCard = cards[activeId];
      if (!activeCard) return;

      const isOverCard = overId in cards;
      const isOverList = overId in lists;

      if (isOverCard) {
        const overCard = cards[overId];
        if (!overCard || activeCard.listId === overCard.listId) return;

        // Single action: move card to target list at the correct position
        const targetListCards = getListCards(overCard.listId);
        const overIndex = targetListCards.findIndex((c) => c.id === overId);
        const newOrder = overIndex >= 0 ? overIndex : targetListCards.length;
        moveCard(activeId, overCard.listId, newOrder);
      } else if (isOverList && activeCard.listId !== overId) {
        // Dropping onto an empty list
        moveCard(activeId, overId, 0);
      }
    },
    [cards, lists, getListCards, moveCard],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDrag(null);

      if (!over) return;

      const activeId = active.id as ID;
      const overId = over.id as ID;

      if (activeId === overId) return;

      const isActiveList = activeId in lists;
      const isActiveCard = activeId in cards;

      if (isActiveList) {
        const boardLists = getBoardLists(boardId);
        const listIds = boardLists.map((l) => l.id);
        const oldIndex = listIds.indexOf(activeId);
        const newIndex = listIds.indexOf(overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          reorderLists(boardId, arrayMove(listIds, oldIndex, newIndex));
        }
        return;
      }

      if (isActiveCard) {
        const card = cards[activeId];
        if (!card) return;

        const listCards = getListCards(card.listId);
        const cardIds = listCards.map((c) => c.id);
        const oldIndex = cardIds.indexOf(activeId);
        const newIndex = cardIds.indexOf(overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          reorderCards(card.listId, arrayMove(cardIds, oldIndex, newIndex));
        }
      }
    },
    [
      cards,
      lists,
      getBoardLists,
      getListCards,
      reorderLists,
      reorderCards,
      boardId,
    ],
  );

  const handleDragCancel = useCallback(() => setActiveDrag(null), []);

  return {
    activeDrag,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
