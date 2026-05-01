export type ID = string;

// Comment
export interface IComment {
  id: ID;
  text: string;
  author: string;
  createdAt: string; // ISO date string
}

// Card
export interface ICard {
  id: ID;
  title: string;
  description: string;
  listId: ID;
  boardId: ID;
  order: number;
  comments: IComment[];
  createdAt: string;
  updatedAt: string;
}

// List
export interface IList {
  id: ID;
  title: string;
  boardId: ID;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Board
export interface IBoard {
  id: ID;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// Normalized State Shape
// Using normalized state for O(1) lookups (performance best practice)
export interface IBoardState {
  boards: Record<ID, IBoard>;
  lists: Record<ID, IList>;
  cards: Record<ID, ICard>;
}

// Computed Types
export interface IListWithCards extends IList {
  cards: ICard[];
}

export interface IBoardWithLists extends IBoard {
  lists: IListWithCards[];
}

// Action Payloads
export interface ICreateBoardPayload {
  title: string;
  description?: string;
  color?: string;
}

export interface IUpdateBoardPayload {
  id: ID;
  title?: string;
  description?: string;
  color?: string;
}

export interface ICreateListPayload {
  title: string;
  boardId: ID;
}

export interface IUpdateListPayload {
  id: ID;
  title?: string;
}

export interface ICreateCardPayload {
  title: string;
  listId: ID;
  boardId: ID;
  description?: string;
}

export interface IUpdateCardPayload {
  id: ID;
  title?: string;
  description?: string;
}

export interface IAddCommentPayload {
  cardId: ID;
  text: string;
  author?: string;
}

// DnD Types
export type DragItemType = 'CARD' | 'LIST';

export interface IDragEndResult {
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
export interface IModalState {
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
