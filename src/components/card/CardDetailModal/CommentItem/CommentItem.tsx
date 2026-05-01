"use client";
import React, { memo, useCallback } from "react";
import { timeAgo, formatDate } from "@/utils";
import type { ID } from "@/types";
import styles from "../CardDetailModal.module.scss";

interface CommentItemProps {
  comment: { id: string; text: string; author: string; createdAt: string };
  cardId: ID;
  onDelete: (cardId: ID, commentId: ID) => void;
}

export const CommentItem = memo(function CommentItem({
  comment,
  cardId,
  onDelete,
}: CommentItemProps) {
  const handleDelete = useCallback(() => {
    onDelete(cardId, comment.id);
  }, [cardId, comment.id, onDelete]);

  return (
    <li className={styles.commentItem}>
      <div className={styles.avatar}>
        {comment.author.charAt(0).toUpperCase()}
      </div>
      <div className={styles.commentBody}>
        <div className={styles.commentMeta}>
          <span className={styles.author}>{comment.author}</span>
          <time
            className={styles.time}
            dateTime={comment.createdAt}
            title={formatDate(comment.createdAt)}
          >
            {timeAgo(comment.createdAt)}
          </time>
        </div>
        <p className={styles.commentText}>{comment.text}</p>
        <button className={styles.deleteComment} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
});
