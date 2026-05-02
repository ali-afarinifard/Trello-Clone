import { useMemo } from 'react';
import { useBoardStore } from '@/stores/boardStore';
import type { IBoard, IBoardWithLists, ID } from '@/types';
import { sortByOrder } from '@/utils';

interface IUseBoardReturn {
  board: IBoard | undefined;
  listsWithCards: IBoardWithLists['lists'];
  listCount: number;
  cardCount: number;
}

export function useBoard(boardId: ID): IUseBoardReturn {
  const boards = useBoardStore((state) => state.boards);
  const lists  = useBoardStore((state) => state.lists);
  const cards  = useBoardStore((state) => state.cards);

  const board = boards[boardId];

  const listsWithCards = useMemo(() => {
    const boardLists = sortByOrder(
      Object.values(lists).filter((l) => l.boardId === boardId)
    );
    return boardLists.map((list) => ({
      ...list,
      cards: sortByOrder(Object.values(cards).filter((c) => c.listId === list.id)),
    }));
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