"use client";
import React, { memo, useCallback } from "react";
import styles from "../CardDetailModal.module.scss";

interface DescContentProps {
  description: string | undefined;
  onStartEditing: () => void;
}

export const DescContent = memo(function DescContent({
  description,
  onStartEditing,
}: DescContentProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") onStartEditing();
    },
    [onStartEditing],
  );

  return (
    <div
      className={styles.descContent}
      onClick={onStartEditing}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {description ? (
        <p className={styles.descText}>{description}</p>
      ) : (
        <p className={styles.descPlaceholder}>
          Add a more detailed description...
        </p>
      )}
    </div>
  );
});
