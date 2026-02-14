'use client';

import React, { useState, useRef, useCallback } from 'react';
import { AlignLeft, MessageSquare, CreditCard } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useBoardStore } from '@/stores/boardStore';
import { useInlineEdit } from '@/hooks/useInlineEdit';
import { timeAgo, formatDate } from '@/utils';
import type { ID } from '@/types';
import styles from './CardDetailModal.module.scss';

interface CardDetailModalProps {
  cardId:  ID | null;
  isOpen:  boolean;
  onClose: () => void;
}

export function CardDetailModal({ cardId, isOpen, onClose }: CardDetailModalProps) {
  const card          = useBoardStore((s) => (cardId ? s.cards[cardId] : undefined));
  const lists         = useBoardStore((s) => s.lists);
  const updateCard    = useBoardStore((s) => s.updateCard);
  const addComment    = useBoardStore((s) => s.addComment);
  const deleteComment = useBoardStore((s) => s.deleteComment);

  const [commentText,          setCommentText]          = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descValue,            setDescValue]            = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const listName = card ? (lists[card.listId]?.title ?? 'Unknown') : '';

  const titleEdit = useInlineEdit({
    initialValue: card?.title ?? '',
    onSave: (value) => { if (cardId) updateCard({ id: cardId, title: value }); },
  });

  const startDescEdit = useCallback(() => { setDescValue(card?.description ?? ''); setIsEditingDescription(true); }, [card?.description]);
  const saveDesc      = useCallback(() => { if (cardId) updateCard({ id: cardId, description: descValue }); setIsEditingDescription(false); }, [cardId, descValue, updateCard]);
  const cancelDesc    = useCallback(() => setIsEditingDescription(false), []);

  const handleAddComment = useCallback(() => {
    const trimmed = commentText.trim();
    if (!trimmed || !cardId) return;
    addComment({ cardId, text: trimmed });
    setCommentText('');
  }, [commentText, cardId, addComment]);

  const handleCommentKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); }
    if (e.key === 'Escape') { setCommentText(''); commentRef.current?.blur(); }
  }, [handleAddComment]);

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className={styles.container}>

        {/* ── Main ─────────────────────────────────────────── */}
        <div className={styles.main}>

          {/* Title */}
          <div className={styles.titleSection}>
            <span className={styles.sectionIcon} aria-hidden="true">
              <CreditCard size={16} />
            </span>
            <div className={styles.titleContent}>
              {titleEdit.isEditing ? (
                <textarea
                  ref={titleEdit.inputRef as React.RefObject<HTMLTextAreaElement>}
                  className={styles.titleInput}
                  value={titleEdit.value}
                  onChange={titleEdit.handleChange}
                  onKeyDown={titleEdit.handleKeyDown}
                  onBlur={titleEdit.handleBlur}
                  rows={2}
                />
              ) : (
                <h2 className={styles.title} onClick={titleEdit.startEditing} role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && titleEdit.startEditing()}>
                  {card.title}
                </h2>
              )}
              <p className={styles.listLabel}>in list <span className={styles.listName}>{listName}</span></p>
            </div>
          </div>

          {/* Description */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                <AlignLeft size={16} />
              </span>
              <h3 className={styles.sectionTitle}>Description</h3>
              {!isEditingDescription && (
                <Button variant="secondary" size="sm" onClick={startDescEdit}>Edit</Button>
              )}
            </div>

            {isEditingDescription ? (
              <div className={styles.editArea}>
                <textarea className={styles.textarea} value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && cancelDesc()}
                  placeholder="Add a more detailed description..." rows={4} autoFocus />
                <div className={styles.editActions}>
                  <Button variant="primary" size="sm" onClick={saveDesc}>Save</Button>
                  <Button variant="ghost"   size="sm" onClick={cancelDesc}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className={styles.descContent} onClick={startDescEdit} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && startDescEdit()}>
                {card.description
                  ? <p className={styles.descText}>{card.description}</p>
                  : <p className={styles.descPlaceholder}>Add a more detailed description...</p>
                }
              </div>
            )}
          </div>

          {/* Comments */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                <MessageSquare size={16} />
              </span>
              <h3 className={styles.sectionTitle}>
                Comments
                {card.comments.length > 0 && <span className={styles.count}>{card.comments.length}</span>}
              </h3>
            </div>

            <div className={styles.addComment}>
              <div className={styles.avatar} aria-hidden="true">Y</div>
              <div className={styles.commentInputWrapper}>
                <textarea
                  ref={commentRef}
                  className={styles.commentInput}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  placeholder="Write a comment... (Enter to submit)"
                  rows={commentText ? 3 : 1}
                />
                {commentText.trim() && (
                  <div className={styles.editActions}>
                    <Button variant="primary" size="sm" onClick={handleAddComment}>Save</Button>
                    <Button variant="ghost"   size="sm" onClick={() => setCommentText('')}>Cancel</Button>
                  </div>
                )}
              </div>
            </div>

            {card.comments.length > 0 && (
              <ul className={styles.commentList} role="list">
                {[...card.comments]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((comment) => (
                    <li key={comment.id} className={styles.commentItem}>
                      <div className={styles.avatar}>{comment.author.charAt(0).toUpperCase()}</div>
                      <div className={styles.commentBody}>
                        <div className={styles.commentMeta}>
                          <span className={styles.author}>{comment.author}</span>
                          <time className={styles.time} dateTime={comment.createdAt} title={formatDate(comment.createdAt)}>
                            {timeAgo(comment.createdAt)}
                          </time>
                        </div>
                        <p className={styles.commentText}>{comment.text}</p>
                        <button className={styles.deleteComment} onClick={() => deleteComment(card.id, comment.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside className={styles.sidebar}>
          <div className={styles.metaBlock}>
            <p className={styles.metaLabel}>Created</p>
            <p className={styles.metaValue}>{formatDate(card.createdAt)}</p>
          </div>
          <div className={styles.metaBlock}>
            <p className={styles.metaLabel}>Updated</p>
            <p className={styles.metaValue}>{timeAgo(card.updatedAt)}</p>
          </div>
        </aside>
      </div>
    </Modal>
  );
}