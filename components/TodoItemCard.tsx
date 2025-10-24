import React from 'react';
import { TodoItem, ColumnId } from '../types';
import { TrashIcon, ClockIcon } from './Icons';

interface TodoItemCardProps {
  item: TodoItem;
  columnId: ColumnId;
  onToggle: (id: string, columnId: ColumnId) => void;
  onDelete: (id: string, columnId: ColumnId) => void;
  onDragStart: (item: TodoItem, fromColumn: ColumnId) => void;
  onDragEnd: () => void;
  onDrop: (targetItem: TodoItem, toColumn: ColumnId) => void;
}

const TodoItemCard: React.FC<TodoItemCardProps> = ({ item, columnId, onToggle, onDelete, onDragStart, onDragEnd, onDrop }) => {
  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !item.completed;
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div
      draggable="true"
      onDragStart={() => onDragStart(item, columnId)}
      onDragEnd={onDragEnd}
      onDrop={(e) => {
        e.stopPropagation();
        onDrop(item, columnId);
      }}
      onDragOver={handleDragOver}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 flex flex-col transition-all duration-200 hover:shadow-lg cursor-grab active:cursor-grabbing"
      aria-roledescription="Draggable task item"
    >
      <div className="flex items-start flex-grow">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id, columnId)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
          aria-labelledby={`todo-text-${item.id}`}
        />
        <div className="ml-3 flex-grow">
            <span id={`todo-text-${item.id}`} className={`text-gray-800 dark:text-gray-200 ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {item.text}
            </span>
            {item.dueDate && (
                <div className={`mt-2 text-sm flex items-center ${isOverdue ? 'text-red-500 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                    <ClockIcon /> 
                    <span className="ml-1">
                        {new Date(item.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                </div>
            )}
        </div>
        <button
            onClick={() => onDelete(item.id, columnId)}
            className="p-1 ml-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
            aria-label="Delete item"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default TodoItemCard;
