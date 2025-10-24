import React, { useState } from 'react';
import { TodoItem, ColumnId } from '../types';
import TodoItemCard from './TodoItemCard';
import { PlusIcon } from './Icons';

interface ColumnProps {
  title: string;
  items: TodoItem[];
  columnId: ColumnId;
  color: string;
  onAdd: (text: string, columnId: ColumnId, dueDate?: string) => void;
  onToggle: (id: string, columnId: ColumnId) => void;
  onDelete: (id: string, columnId: ColumnId) => void;
  onDragStart: (item: TodoItem, fromColumn: ColumnId) => void;
  onDragEnd: () => void;
  onDrop: (targetItem: TodoItem | null, toColumn: ColumnId) => void;
  onDragEnter: (columnId: ColumnId) => void;
  isDraggingOver: boolean;
}

const Column: React.FC<ColumnProps> = ({ title, items, columnId, color, onAdd, onToggle, onDelete, onDragStart, onDragEnd, onDrop, onDragEnter, isDraggingOver }) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAdd(newTodoText.trim(), columnId, dueDate || undefined);
      setNewTodoText('');
      setDueDate('');
    }
  };

  return (
    <div
      onDrop={() => onDrop(null, columnId)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => onDragEnter(columnId)}
      className={`bg-gray-200 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col w-full transition-colors duration-300 ${isDraggingOver ? 'bg-blue-200 dark:bg-blue-900/50 ring-2 ring-blue-500' : ''}`}
    >
      <h2 className={`text-xl font-bold mb-4 pb-2 border-b-4 ${color} text-gray-800 dark:text-gray-100`}>
        {title} ({items.length})
      </h2>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {items.map(item => (
          <TodoItemCard
            key={item.id}
            item={item}
            columnId={columnId}
            onToggle={onToggle}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
          />
        ))}
        {items.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            Drop tasks here or add a new one below.
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            aria-label="New task description"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
            disabled={!newTodoText.trim()}
            aria-label="Add task"
          >
            <PlusIcon />
          </button>
        </div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          aria-label="Task due date"
        />
      </form>
    </div>
  );
};

export default Column;
