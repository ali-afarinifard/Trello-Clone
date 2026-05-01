import { v4 as uuidv4 } from 'uuid';
import type { ICard, IList } from '@/types';


export const generateId = (): string => uuidv4();


// Date Helpers
export const now = (): string => new Date().toISOString();

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const timeAgo = (isoString: string): string => {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(isoString);
};

// Array Helpers
export const reorder = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

export const moveBetweenArrays = <T>(
  source: T[],
  destination: T[],
  fromIndex: number,
  toIndex: number
): { source: T[]; destination: T[] } => {
  const sourceCopy = [...source];
  const destCopy = [...destination];
  const [removed] = sourceCopy.splice(fromIndex, 1);
  destCopy.splice(toIndex, 0, removed);
  return { source: sourceCopy, destination: destCopy };
};

// Sort Helpers
export const sortByOrder = <T extends { order: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.order - b.order);

export const getSortedCards = (cards: ICard[]): ICard[] => sortByOrder(cards);

export const getSortedLists = (lists: IList[]): IList[] => sortByOrder(lists);

// Normalization Helpers

export const toRecord = <T extends { id: string }>(items: T[]): Record<string, T> =>
  items.reduce<Record<string, T>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

// Truncation
export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;
