import { useState, useCallback } from 'react';
import type { ID } from '@/types';

interface IUseModalReturn {
  isOpen: boolean;
  selectedId: ID | null;
  openModal: (id?: ID) => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export function useModal(): IUseModalReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<ID | null>(null);

  const openModal = useCallback((id?: ID) => {
    setSelectedId(id ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setSelectedId(null), 300);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, selectedId, openModal, closeModal, toggleModal };
}
