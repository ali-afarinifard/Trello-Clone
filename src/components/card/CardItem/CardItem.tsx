"use client";
import React, { memo, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageSquare, AlignLeft } from "lucide-react";
import type { Card } from "@/types";
import styles from "./CardItem.module.scss";

interface CardItemProps {
  card: Card;
  onOpenDetail: (cardId: string) => void;
  isDragOverlay?: boolean;
}

export const CardItem = memo(function CardItem({
  card,
  onOpenDetail,
  isDragOverlay = false,
}: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "CARD", card },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const classNames = [
    styles.card,
    isDragging ? styles["card--dragging"] : "",
    isDragOverlay ? styles["card--overlay"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = useCallback(() => {
    onOpenDetail(card.id);
  }, [card.id, onOpenDetail]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpenDetail(card.id);
      }
    },
    [card.id, onOpenDetail],
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames}
      {...attributes}
      {...listeners}
    >
      <div
        className={styles.cardInner}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Open card: ${card.title}`}
        onKeyDown={handleKeyDown}
      >
        <p className={styles.title}>{card.title}</p>

        {card.comments.length > 0 && (
          <div className={styles.badges}>
            <span
              className={styles.commentBadge}
              title={`${card.comments.length} comment(s)`}
            >
              <MessageSquare size={12} />
              {card.comments.length}
            </span>
          </div>
        )}

        {card.description && (
          <div className={styles.descIndicator} aria-label="Has description">
            <AlignLeft size={12} />
          </div>
        )}
      </div>
    </div>
  );
});
