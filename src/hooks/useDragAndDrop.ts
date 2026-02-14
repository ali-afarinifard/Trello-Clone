import { useState, useCallback } from 'react';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useBoardStore } from '@/stores/boardStore';
import type { ID } from '@/types';

type DragType = 'CARD' | 'LIST' | null;

interface ActiveDragState {
  id: ID;
  type: DragType;
}

interface UseDragAndDropReturn {
  activeDrag: ActiveDragState | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
}

export function useDragAndDrop(boardId: ID): UseDragAndDropReturn {
  const [activeDrag, setActiveDrag] = useState<ActiveDragState | null>(null);

  const getBoardLists = useBoardStore((state) => state.getBoardLists);
  const getListCards = useBoardStore((state) => state.getListCards);
  const reorderLists = useBoardStore((state) => state.reorderLists);
  const reorderCards = useBoardStore((state) => state.reorderCards);
  const moveCard = useBoardStore((state) => state.moveCard);
  const cards = useBoardStore((state) => state.cards);
  const lists = useBoardStore((state) => state.lists);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const activeId = active.id as ID;

      const isCard = activeId in cards;
      const type: DragType = isCard ? 'CARD' : 'LIST';

      setActiveDrag({ id: activeId, type });
    },
    [cards]
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
        if (!overCard) return;

        // Moving to a different list
        if (activeCard.listId !== overCard.listId) {
          const targetListCards = getListCards(overCard.listId);
          const overIndex = targetListCards.findIndex((c) => c.id === overId);
          const newOrder = overIndex >= 0 ? overIndex : targetListCards.length;
          moveCard(activeId, overCard.listId, newOrder);

          // Reorder destination list
          const newDestCards = [...targetListCards];
          newDestCards.splice(newOrder, 0, { ...activeCard, listId: overCard.listId });
          reorderCards(
            overCard.listId,
            newDestCards.map((c) => c.id)
          );
        }
      } else if (isOverList && activeCard.listId !== overId) {
        // Dropping onto an empty list
        moveCard(activeId, overId, 0);
      }
    },
    [cards, lists, getListCards, moveCard, reorderCards]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDrag(null);

      if (!over) return;

      const activeId = active.id as ID;
      const overId = over.id as ID;

      if (activeId === overId) return;

      const isActiveCard = activeId in cards;
      const isActiveList = activeId in lists;

      if (isActiveList) {
        // Reorder lists
        const boardLists = getBoardLists(boardId);
        const listIds = boardLists.map((l) => l.id);
        const oldIndex = listIds.indexOf(activeId);
        const newIndex = listIds.indexOf(overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(listIds, oldIndex, newIndex);
          reorderLists(boardId, reordered);
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
          const reordered = arrayMove(cardIds, oldIndex, newIndex);
          reorderCards(card.listId, reordered);
        }
      }
    },
    [cards, lists, getBoardLists, getListCards, reorderLists, reorderCards, boardId]
  );

  const handleDragCancel = useCallback(() => {
    setActiveDrag(null);
  }, []);

  return {
    activeDrag,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
