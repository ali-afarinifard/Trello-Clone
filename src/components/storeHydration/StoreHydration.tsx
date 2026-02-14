'use client';

import { useEffect } from 'react';
import { useBoardStore } from '@/stores/boardStore';

export function StoreHydration() {
  const hydrateFromStorage = useBoardStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return null;
}