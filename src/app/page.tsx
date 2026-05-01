'use client';
import React, { useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { BoardCard } from '@/components/board/BoardCard/BoardCard';
import { CreateBoardModal } from '@/components/board/CreateBoardModal/CreateBoardModal';
import { useModal } from '@/hooks/useModal';
import { useBoardStore } from '@/stores/boardStore';
import { Navbar } from '@/components/layout';
import styles from './page.module.scss';

export default function HomePage() {
  const { isOpen, openModal, closeModal } = useModal();

  const boards      = useBoardStore((state) => state.boards);
  const lists       = useBoardStore((state) => state.lists);
  const cards       = useBoardStore((state) => state.cards);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);

  const allBoards = useMemo(
    () =>
      Object.values(boards).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [boards]
  );

  const getBoardStats = useCallback(
    (boardId: string) => ({
      listCount: Object.values(lists).filter((l) => l.boardId === boardId).length,
      cardCount: Object.values(cards).filter((c) => c.boardId === boardId).length,
    }),
    [lists, cards]
  );

  const handleOpenModal = useCallback(() => openModal(), [openModal]);

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main} id="main-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.heading}>Your Boards</h1>
            <p className={styles.subheading}>
              {allBoards.length === 0
                ? 'Create your first board to get started'
                : `${allBoards.length} board${allBoards.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className={styles.grid}>
            {allBoards.map((board) => {
              const { listCount, cardCount } = getBoardStats(board.id);
              return (
                <BoardCard
                  key={board.id}
                  board={board}
                  listCount={listCount}
                  cardCount={cardCount}
                  onDelete={deleteBoard}
                />
              );
            })}

            <button
              className={styles.createBtn}
              onClick={handleOpenModal}
              aria-label="Create new board"
            >
              <Plus size={20} />
              Create new board
            </button>
          </div>
        </div>
      </main>

      <CreateBoardModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}