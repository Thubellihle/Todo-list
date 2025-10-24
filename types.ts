export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export enum ColumnId {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Todos = Record<ColumnId, TodoItem[]>;
