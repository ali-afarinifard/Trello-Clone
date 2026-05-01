// CreateBoardModal/CreateBoardModal.tsx
'use client';
import React, { useState, useCallback } from 'react';
import { Modal }         from '@/components/ui/Modal';
import { Button }        from '@/components/ui/Button';
import { Input }         from '@/components/ui/Input';
import { useBoardStore } from '@/stores/boardStore';
import { BOARD_COLORS }  from '@/types';
import type { BoardColorKey } from '@/types';
import styles from './CreateBoardModal.module.scss';
import { ColorSwatch } from './ColorSwatch/ColorSwatch';

interface CreateBoardModalProps {
  isOpen:     boolean;
  onClose:    () => void;
  onCreated?: (boardId: string) => void;
}

export function CreateBoardModal({ isOpen, onClose, onCreated }: CreateBoardModalProps) {
  const [title,         setTitle]         = useState('');
  const [description,   setDescription]   = useState('');
  const [selectedColor, setSelectedColor] = useState<BoardColorKey>('ocean');
  const [error,         setError]         = useState('');

  const createBoard = useBoardStore((state) => state.createBoard);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError('');
  }, [error]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleColorSelect = useCallback((key: BoardColorKey) => {
    setSelectedColor(key);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedTitle = title.trim();
      if (!trimmedTitle) { setError('Board title is required'); return; }
      if (trimmedTitle.length > 100) { setError('Title must be 100 characters or less'); return; }

      const board = createBoard({
        title: trimmedTitle,
        description: description.trim(),
        color: selectedColor,
      });

      setTitle('');
      setDescription('');
      setSelectedColor('ocean');
      setError('');
      onClose();
      onCreated?.(board.id);
    },
    [title, description, selectedColor, createBoard, onClose, onCreated]
  );

  const handleClose = useCallback(() => {
    setTitle('');
    setDescription('');
    setSelectedColor('ocean');
    setError('');
    onClose();
  }, [onClose]);

  const selectedColorValue =
    BOARD_COLORS.find((c) => c.key === selectedColor)?.value ?? BOARD_COLORS[0].value;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create board" size="sm">
      <div className={styles.container}>
        <div
          className={styles.preview}
          style={{ background: selectedColorValue }}
          aria-label="Board preview"
        >
          <div className={styles.previewCard} />
          <div className={styles.previewCard} />
          <div className={styles.previewCard} />
        </div>

        <div className={styles.colorPicker}>
          <p className={styles.colorLabel}>Background</p>
          <div className={styles.colorGrid} role="radiogroup" aria-label="Choose board color">
            {BOARD_COLORS.map((color) => (
              <ColorSwatch
                key={color.key}
                colorKey={color.key as BoardColorKey}
                colorValue={color.value}
                isSelected={selectedColor === color.key}
                onSelect={handleColorSelect}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Board title *"
            value={title}
            onChange={handleTitleChange}
            placeholder="My awesome board"
            error={error}
            maxLength={100}
            autoFocus
            required
          />

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="board-desc">Description</label>
            <textarea
              id="board-desc"
              className={styles.textarea}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="What is this board for?"
              rows={2}
              maxLength={300}
            />
          </div>

          <div className={styles.actions}>
            <Button type="submit" variant="primary" fullWidth disabled={!title.trim()}>
              Create board
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}