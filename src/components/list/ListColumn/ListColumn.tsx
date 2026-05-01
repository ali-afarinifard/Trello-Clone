"use client";
import React, { useState, useCallback, memo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X, Trash2 } from "lucide-react";
import { CardItem } from "@/components/card/CardItem/CardItem";
import { Button } from "@/components/ui/Button";
import { useBoardStore } from "@/stores/boardStore";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import type { List, Card } from "@/types";
import styles from "./ListColumn.module.scss";

interface ListColumnProps {
  list: List;
  cards: Card[];
  onOpenCardDetail: (cardId: string) => void;
  isDragOverlay?: boolean;
}

export const ListColumn = memo(function ListColumn({
  list,
  cards,
  onOpenCardDetail,
  isDragOverlay = false,
}: ListColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const createCard = useBoardStore((s) => s.createCard);
  const updateList = useBoardStore((s) => s.updateList);
  const deleteList = useBoardStore((s) => s.deleteList);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: { type: "LIST", list },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const titleEdit = useInlineEdit({
    initialValue: list.title,
    onSave: (value) => updateList({ id: list.id, title: value }),
  });

  const handleAddCard = useCallback(() => {
    const trimmed = newCardTitle.trim();
    if (!trimmed) {
      setIsAddingCard(false);
      return;
    }
    createCard({ title: trimmed, listId: list.id, boardId: list.boardId });
    setNewCardTitle("");
  }, [newCardTitle, createCard, list.id, list.boardId]);

  const handleAddCardKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddCard();
      }
      if (e.key === "Escape") {
        setIsAddingCard(false);
        setNewCardTitle("");
      }
    },
    [handleAddCard],
  );

  const cardIds = cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        styles.column,
        isDragging ? styles["column--dragging"] : "",
        isDragOverlay ? styles["column--overlay"] : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header} {...attributes} {...listeners}>
          {titleEdit.isEditing ? (
            <input
              ref={titleEdit.inputRef as React.RefObject<HTMLInputElement>}
              className={styles.titleInput}
              value={titleEdit.value}
              onChange={titleEdit.handleChange}
              onKeyDown={titleEdit.handleKeyDown}
              onBlur={titleEdit.handleBlur}
            />
          ) : (
            <h3
              className={styles.title}
              onClick={titleEdit.startEditing}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && titleEdit.startEditing()}
            >
              {list.title}
            </h3>
          )}

          <span className={styles.count}>{cards.length}</span>

          <button
            className={styles.deleteBtn}
            onClick={() => deleteList(list.id)}
            aria-label={`Delete ${list.title}`}
            title="Delete list"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Cards */}
        <div className={styles.cardsArea}>
          <SortableContext
            items={cardIds}
            strategy={verticalListSortingStrategy}
          >
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onOpenDetail={onOpenCardDetail}
              />
            ))}
          </SortableContext>
          {cards.length === 0 && !isAddingCard && (
            <div className={styles.emptyZone} />
          )}
        </div>

        {/* Add card */}
        {isAddingCard ? (
          <div className={styles.addCardForm}>
            <textarea
              className={styles.addCardInput}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleAddCardKeyDown}
              placeholder="Enter a title for this card..."
              rows={3}
              autoFocus
            />
            <div className={styles.addCardActions}>
              <Button variant="primary" size="sm" onClick={handleAddCard}>
                Add card
              </Button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            className={styles.addCardBtn}
            onClick={() => setIsAddingCard(true)}
          >
            <Plus size={14} />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
});
