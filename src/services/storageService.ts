import type { BoardState } from '@/types';

const STORAGE_KEYS = {
  BOARD_STATE: 'trello_clone_board_state',
  VERSION: 'trello_clone_version',
} as const;

const CURRENT_VERSION = '1.0.0';

const isBrowser = (): boolean => typeof window !== 'undefined';

export function getFromStorage<T>(key: string): T | null {
  if (!isBrowser()) return null;

  try {
    const serialized = window.localStorage.getItem(key);
    if (serialized === null) return null;
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`[StorageService] Failed to read key "${key}":`, error);
    return null;
  }
}

export function setToStorage<T>(key: string, value: T): boolean {
  if (!isBrowser()) return false;

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[StorageService] Failed to write key "${key}":`, error);
    return false;
  }
}

export function removeFromStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`[StorageService] Failed to remove key "${key}":`, error);
  }
}


export function loadBoardState(): BoardState | null {
  return getFromStorage<BoardState>(STORAGE_KEYS.BOARD_STATE);
}

export function saveBoardState(state: BoardState): void {
  setToStorage(STORAGE_KEYS.BOARD_STATE, state);
  setToStorage(STORAGE_KEYS.VERSION, CURRENT_VERSION);
}

export function clearAllData(): void {
  removeFromStorage(STORAGE_KEYS.BOARD_STATE);
  removeFromStorage(STORAGE_KEYS.VERSION);
}
