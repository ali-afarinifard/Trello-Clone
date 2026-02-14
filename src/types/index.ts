export type ID = string;

// Comment
export interface Comment {
  id: ID;
  text: string;
  author: string;
  createdAt: string; // ISO date string
}

// Card
export interface Card {
  id: ID;
  title: string;
  description: string;
  listId: ID;
  boardId: ID;
  order: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// List
export interface List {
  id: ID;
  title: string;
  boardId: ID;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Board
export interface Board {
  id: ID;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// Normalized State Shape
// Using normalized state for O(1) lookups (performance best practice)
export interface BoardState {
  boards: Record<ID, Board>;
  lists: Record<ID, List>;
  cards: Record<ID, Card>;
}

// Computed Types
export interface ListWithCards extends List {
  cards: Card[];
}

export interface BoardWithLists extends Board {
  lists: ListWithCards[];
}

// Action Payloads
export interface CreateBoardPayload {
  title: string;
  description?: string;
  color?: string;
}

export interface UpdateBoardPayload {
  id: ID;
  title?: string;
  description?: string;
  color?: string;
}

export interface CreateListPayload {
  title: string;
  boardId: ID;
}

export interface UpdateListPayload {
  id: ID;
  title?: string;
}

export interface CreateCardPayload {
  title: string;
  listId: ID;
  boardId: ID;
  description?: string;
}

export interface UpdateCardPayload {
  id: ID;
  title?: string;
  description?: string;
}

export interface AddCommentPayload {
  cardId: ID;
  text: string;
  author?: string;
}

// DnD Types
export type DragItemType = 'CARD' | 'LIST';

export interface DragEndResult {
  draggableId: ID;
  type: DragItemType;
  source: {
    droppableId: ID;
    index: number;
  };
  destination: {
    droppableId: ID;
    index: number;
  } | null;
}

// UI State Types
export interface ModalState {
  isOpen: boolean;
  cardId: ID | null;
}

// Board Color Options
export const BOARD_COLORS = [
  { key: 'ocean', value: 'linear-gradient(135deg, #0079bf, #005a8e)' },
  { key: 'sky', value: 'linear-gradient(135deg, #00aecc, #0079bf)' },
  { key: 'lime', value: 'linear-gradient(135deg, #61bd4f, #4a9a3d)' },
  { key: 'sunset', value: 'linear-gradient(135deg, #eb5a46, #c9372c)' },
  { key: 'purple', value: 'linear-gradient(135deg, #c377e0, #9f5fb2)' },
  { key: 'pink', value: 'linear-gradient(135deg, #ff78cb, #e44f9f)' },
  { key: 'orange', value: 'linear-gradient(135deg, #ffab4a, #e0892a)' },
  { key: 'teal', value: 'linear-gradient(135deg, #00c2e0, #0098b3)' },
] as const;

export type BoardColorKey = (typeof BOARD_COLORS)[number]['key'];
