'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  title?:   string;
  size?:    'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%`;
    return () => { document.body.style.cssText = ''; window.scrollTo(0, scrollY); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => { if (e.target === overlayRef.current) onClose(); },
    [onClose]
  );

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div ref={overlayRef} className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}
        className={[styles.dialog, styles[`dialog--${size}`]].join(' ')}>

        {title && (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>{title}</h2>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  );
}