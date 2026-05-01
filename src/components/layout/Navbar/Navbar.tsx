'use client';
import React from 'react';
import Link from 'next/link';
import { useInlineEdit } from '@/hooks/useInlineEdit';
import { useBoardStore } from '@/stores/boardStore';
import styles from './Navbar.module.scss';
import { Logo } from '@/components/ui/Logo';

interface INavbarProps {
  boardTitle?: string;
  boardId?:    string;
}

export function Navbar({ boardTitle, boardId }: INavbarProps) {
  const updateBoard = useBoardStore((s) => s.updateBoard);

  const {
    isEditing,
    value,
    inputRef,
    startEditing,
    handleChange,
    handleKeyDown,
    handleBlur,
  } = useInlineEdit({
    initialValue: boardTitle ?? '',
    onSave: (newTitle) => {
      if (boardId) updateBoard({ id: boardId, title: newTitle });
    },
  });

  return (
    <header className={styles.navbar} role="banner">
      <div className={styles.left}>
        <Link href="/" className={styles.logo} aria-label="Trello Clone - Go to boards">
          <Logo />
          <span className={styles.logoText}>Trello</span>
        </Link>

        {boardTitle && (
          <>
            <span className={styles.separator} aria-hidden="true">/</span>

            {isEditing ? (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                className={styles.titleInput}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                maxLength={100}
                aria-label="Edit board title"
              />
            ) : (
              <button
                className={styles.titleBtn}
                onClick={startEditing}
                title="Click to edit board title"
                aria-label={`Board title: ${boardTitle}. Click to edit.`}
              >
                {boardTitle}
              </button>
            )}
          </>
        )}
      </div>

      <nav className={styles.right} aria-label="Main navigation">
        <Link href="/" className={styles.navLink}>
          Boards
        </Link>
      </nav>
    </header>
  );
}