import type { IBoardState } from '@/types';
import { logger } from '@/utils';

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
    logger.error(`[StorageService] Failed to read key "${key}":`, error);
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
    logger.error(`[StorageService] Failed to write key "${key}":`, error);
    return false;
  }
}

export function removeFromStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    logger.error(`[StorageService] Failed to remove key "${key}":`, error);
  }
}

function isValidBoardState(value: unknown): value is IBoardState {
  if (typeof value !== 'object' || value === null) return false;

  const obj = value as Record<string, unknown>;

  if (typeof obj.boards !== 'object' || obj.boards === null || Array.isArray(obj.boards)) return false;
  if (typeof obj.lists  !== 'object' || obj.lists  === null || Array.isArray(obj.lists))  return false;
  if (typeof obj.cards  !== 'object' || obj.cards  === null || Array.isArray(obj.cards))  return false;

  return true;
}

type MigrationFn = (old: unknown) => IBoardState;

const MIGRATIONS: Record<string, MigrationFn> = {};

function migrateState(state: unknown, fromVersion: string): IBoardState {
  let current = state;
  let version = fromVersion;

  for (const v of Object.keys(MIGRATIONS).sort()) {
    if (version < v) {
      current = MIGRATIONS[v](current);
      version = v;
    }
  }

  return current as IBoardState;
}

export function loadBoardState(): IBoardState | null {
  const raw = getFromStorage<unknown>(STORAGE_KEYS.BOARD_STATE);
  if (!raw) return null;

  const storedVersion = getFromStorage<string>(STORAGE_KEYS.VERSION) ?? '0.0.0';

  try {
    const data = storedVersion === CURRENT_VERSION
      ? raw
      : (() => {
          logger.warn(
            `[StorageService] Version mismatch: stored=${storedVersion}, current=${CURRENT_VERSION}. Running migration...`
          );
          return migrateState(raw, storedVersion);
        })();

    if (!isValidBoardState(data)) {
      logger.error('[StorageService] Invalid BoardState shape, clearing storage.');
      clearAllData();
      return null;
    }

    return data;
  } catch (error) {
    logger.error('[StorageService] Failed to load board state, clearing storage:', error);
    clearAllData();
    return null;
  }
}

export function saveBoardState(state: IBoardState): boolean {
  const stateSaved   = setToStorage(STORAGE_KEYS.BOARD_STATE, state);
  const versionSaved = setToStorage(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  return stateSaved && versionSaved;
}

export function clearAllData(): void {
  removeFromStorage(STORAGE_KEYS.BOARD_STATE);
  removeFromStorage(STORAGE_KEYS.VERSION);
}