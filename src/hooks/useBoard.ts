import { useMemo } from 'react';
import { useBoardStore } from '@/stores/boardStore';
import type { BoardWithLists, ID } from '@/types';

interface UseBoardReturn {
  board: ReturnType<typeof useBoardStore.getState>['boards'][string] | undefined;
  listsWithCards: BoardWithLists['lists'];
  listCount: number;
  cardCount: number;
}

export function useBoard(boardId: ID): UseBoardReturn {
  const boards = useBoardStore((state) => state.boards);
  const lists = useBoardStore((state) => state.lists);
  const cards = useBoardStore((state) => state.cards);
  const getBoardLists = useBoardStore((state) => state.getBoardLists);
  const getListCards = useBoardStore((state) => state.getListCards);

  const board = boards[boardId];

  const listsWithCards = useMemo(() => {
    const boardLists = getBoardLists(boardId);
    return boardLists.map((list) => ({
      ...list,
      cards: getListCards(list.id),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, lists, cards]);

  const cardCount = useMemo(
    () => Object.values(cards).filter((c) => c.boardId === boardId).length,
    [cards, boardId]
  );

  return {
    board,
    listsWithCards,
    listCount: listsWithCards.length,
    cardCount,
  };
}
