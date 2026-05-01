"use client";
import React, { memo, useCallback } from "react";
import type { BoardColorKey } from "@/types";
import styles from "../CreateBoardModal.module.scss";

interface IColorSwatchProps {
  colorKey: BoardColorKey;
  colorValue: string;
  isSelected: boolean;
  onSelect: (key: BoardColorKey) => void;
}

export const ColorSwatch = memo(function ColorSwatch({
  colorKey,
  colorValue,
  isSelected,
  onSelect,
}: IColorSwatchProps) {
  const handleClick = useCallback(
    () => onSelect(colorKey),
    [colorKey, onSelect],
  );

  return (
    <button
      type="button"
      className={[
        styles.colorSwatch,
        isSelected ? styles["colorSwatch--selected"] : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ background: colorValue }}
      onClick={handleClick}
      aria-label={`Color: ${colorKey}`}
      aria-pressed={isSelected}
      title={colorKey}
    >
      {isSelected && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
        </svg>
      )}
    </button>
  );
});
