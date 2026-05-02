// src/app/board/[id]/page.tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { BoardView } from "@/components/board/BoardView/BoardView";
import { useBoardStore } from "@/stores/boardStore";
import { BOARD_COLORS } from "@/types";
import styles from "./page.module.scss";
import { Navbar } from "@/components/layout";

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const boardId = params.id;

  const board = useBoardStore((s) => s.boards[boardId]);

  if (!board) {
    return (
      <div className={`${styles.page} ${styles["page--notFound"]}`}>
        <Navbar />
        <main className={styles.notFound}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 4h7v10H4V4Zm9 6h7v10h-7V10Z" />
          </svg>
          <h1 className={styles.notFoundTitle}>Board not found</h1>
          <p className={styles.notFoundText}>
            This board doesn&apos;t exist or has been deleted.
          </p>
          <a href="/" className={styles.backLink}>
            ← Back to boards
          </a>
        </main>
      </div>
    );
  }

  const bg =
    BOARD_COLORS.find((c) => c.key === board.color)?.value ??
    BOARD_COLORS[0].value;

  return (
    <div className={styles.page} style={{ background: bg }}>
      <Navbar boardTitle={board.title} boardId={boardId} />
      <BoardView boardId={boardId} />
    </div>
  );
}
