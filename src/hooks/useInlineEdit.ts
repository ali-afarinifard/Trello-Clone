import { useState, useCallback, useRef, useEffect } from 'react';

interface IUseInlineEditOptions {
  initialValue: string;
  onSave: (value: string) => void;
  minLength?: number;
}

interface IUseInlineEditReturn {
  isEditing: boolean;
  value: string;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  startEditing: () => void;
  cancelEditing: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
}

export function useInlineEdit({
  initialValue,
  onSave,
  minLength = 1,
}: IUseInlineEditOptions): IUseInlineEditReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const save = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed.length >= minLength) {
      onSave(trimmed);
      setIsEditing(false);
    } else {
      setValue(initialValue);
      setIsEditing(false);
    }
  }, [value, initialValue, onSave, minLength]);

  const startEditing = useCallback(() => {
    setValue(initialValue);
    setIsEditing(true);
  }, [initialValue]);

  const cancelEditing = useCallback(() => {
    setValue(initialValue);
    setIsEditing(false);
  }, [initialValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        save();
      }
      if (e.key === 'Escape') {
        cancelEditing();
      }
    },
    [save, cancelEditing]
  );

  const handleBlur = useCallback(() => {
    save();
  }, [save]);

  return {
    isEditing,
    value,
    inputRef: inputRef as React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
    startEditing,
    cancelEditing,
    handleChange,
    handleKeyDown,
    handleBlur,
  };
}
