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

type MigrationFn = (old: unknown) => BoardState;

const MIGRATIONS: Record<string, MigrationFn> = {};

function migrateState(state: unknown, fromVersion: string): BoardState {
  let current = state;
  let version = fromVersion;

  const versions = Object.keys(MIGRATIONS).sort();

  for (const v of versions) {
    if (version < v) {
      current = MIGRATIONS[v](current);
      version = v;
    }
  }

  return current as BoardState;
}

export function loadBoardState(): BoardState | null {
  const raw = getFromStorage<unknown>(STORAGE_KEYS.BOARD_STATE);
  if (!raw) return null;

  const storedVersion = getFromStorage<string>(STORAGE_KEYS.VERSION) ?? '0.0.0';

  if (storedVersion === CURRENT_VERSION) {
    return raw as BoardState;
  }

  console.warn(
    `[StorageService] Version mismatch: stored=${storedVersion}, current=${CURRENT_VERSION}. Running migration...`
  );

  try {
    const migrated = migrateState(raw, storedVersion);
    return migrated;
  } catch (error) {
    console.error('[StorageService] Migration failed, clearing storage:', error);
    clearAllData();
    return null;
  }
}

export function saveBoardState(state: BoardState): boolean {
  const stateSaved = setToStorage(STORAGE_KEYS.BOARD_STATE, state);
  const versionSaved = setToStorage(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  return stateSaved && versionSaved;
}

export function clearAllData(): void {
  removeFromStorage(STORAGE_KEYS.BOARD_STATE);
  removeFromStorage(STORAGE_KEYS.VERSION);
}