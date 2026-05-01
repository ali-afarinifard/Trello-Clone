'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { X, LayoutList, AlignLeft } from 'lucide-react';
import type { Board } from '@/types';
import { BOARD_COLORS } from '@/types';
import styles from './BoardCard.module.scss';

interface BoardCardProps {
  board:      Board;
  cardCount:  number;
  listCount:  number;
  onDelete:   (boardId: string) => void;
}

const getBoardBackground = (colorKey: string): string => {
  const colorEntry = BOARD_COLORS.find((c) => c.key === colorKey);
  return colorEntry?.value ?? BOARD_COLORS[0].value;
};

export const BoardCard = memo(function BoardCard({ board, cardCount, listCount, onDelete }: BoardCardProps) {
  return (
    <div className={styles.card}>
      <Link
        href={`/board/${board.id}`}
        className={styles.link}
        style={{ background: getBoardBackground(board.color) }}
        aria-label={`Open board: ${board.title}`}
      >
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h3 className={styles.title}>{board.title}</h3>
          {board.description && (
            <p className={styles.description}>{board.description}</p>
          )}
          <div className={styles.stats}>
            <span className={styles.stat}>
              <LayoutList size={12} />
              {listCount} lists
            </span>
            <span className={styles.stat}>
              <AlignLeft size={12} />
              {cardCount} cards
            </span>
          </div>
        </div>
      </Link>

      <button
        className={styles.deleteBtn}
        onClick={(e) => { e.preventDefault(); onDelete(board.id); }}
        aria-label={`Delete board: ${board.title}`}
        title="Delete board"
      >
        <X size={12} />
      </button>
    </div>
  );
});