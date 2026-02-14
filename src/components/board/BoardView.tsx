'use client';
import React, { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Plus, X } from 'lucide-react';

import { ListColumn } from '@/components/list/ListColumn';
import { CardItem } from '@/components/card/CardItem';
import { CardDetailModal } from '@/components/card/CardDetailModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useModal } from '@/hooks/useModal';
import { useBoard } from '@/hooks/useBoard';
import { useBoardStore } from '@/stores/boardStore';
import type { ID } from '@/types';
import styles from './BoardView.module.scss';

interface AddListFormProps {
  boardId: ID;
}

function AddListForm({ boardId }: AddListFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const createList = useBoardStore((state) => state.createList);

  const handleSubmit = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) return;
    createList({ title: trimmed, boardId });
    setTitle('');
  }, [title, createList, boardId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setTitle('');
      }
    },
    [handleSubmit]
  );

  if (!isOpen) {
    return (
      <button
        className={styles.addListBtn}
        onClick={() => setIsOpen(true)}
        aria-label="Add new list"
      >
        <Plus size={16} />
        Add another list
      </button>
    );
  }

  return (
    <div className={styles.addListForm}>
      <input
        className={styles.addListInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter list title..."
        autoFocus
        aria-label="New list title"
      />
      <div className={styles.addListActions}>
        <button
          className={styles.addListSubmit}
          onClick={handleSubmit}
          disabled={!title.trim()}
        >
          Add list
        </button>
        <button
          className={styles.addListCancel}
          onClick={() => {
            setIsOpen(false);
            setTitle('');
          }}
          aria-label="Cancel"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

interface BoardViewProps {
  boardId: ID;
}

export function BoardView({ boardId }: BoardViewProps) {
  const { listsWithCards } = useBoard(boardId);
  const cards = useBoardStore((state) => state.cards);

  const {
    activeDrag,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDrop(boardId);

  const { isOpen, selectedId, openModal, closeModal } = useModal();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const listIds = listsWithCards.map((l) => l.id);

  const renderDragOverlay = () => {
    if (!activeDrag) return null;

    if (activeDrag.type === 'CARD') {
      const card = cards[activeDrag.id];
      if (!card) return null;
      return (
        <CardItem
          card={card}
          onOpenDetail={() => {}}
          onEditTitle={() => {}}
          isDragOverlay
        />
      );
    }

    if (activeDrag.type === 'LIST') {
      const listWithCards = listsWithCards.find((l) => l.id === activeDrag.id);
      if (!listWithCards) return null;
      return (
        <ListColumn
          list={listWithCards}
          cards={listWithCards.cards}
          onOpenCardDetail={() => {}}
          isDragOverlay
        />
      );
    }

    return null;
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className={styles.boardCanvas}>
          <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
            {listsWithCards.map((listWithCards) => (
              <ListColumn
                key={listWithCards.id}
                list={listWithCards}
                cards={listWithCards.cards}
                onOpenCardDetail={openModal}
              />
            ))}
          </SortableContext>

          <AddListForm boardId={boardId} />
        </div>

        {typeof document !== 'undefined' &&
          createPortal(
            <DragOverlay dropAnimation={null}>
              {renderDragOverlay()}
            </DragOverlay>,
            document.body
          )}
      </DndContext>

      <CardDetailModal
        cardId={selectedId}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
}