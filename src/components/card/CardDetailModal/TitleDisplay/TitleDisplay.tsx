"use client";
import React, { memo, useCallback } from "react";
import styles from "../CardDetailModal.module.scss";

interface ITitleDisplayProps {
  title: string;
  onStartEditing: () => void;
}

export const TitleDisplay = memo(function TitleDisplay({
  title,
  onStartEditing,
}: ITitleDisplayProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") onStartEditing();
    },
    [onStartEditing],
  );

  return (
    <h2
      className={styles.title}
      onClick={onStartEditing}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {title}
    </h2>
  );
});
