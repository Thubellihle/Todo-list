import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Column from './components/Column';
import { ColumnId, Todos, TodoItem } from './types';
import { SunIcon, MoonIcon, LogoutIcon } from './components/Icons';

type FilterType = 'all' | 'active' | 'completed';
type Theme = 'light' | 'dark';

// --- Login Form Component ---
const LoginForm = ({ onLogin }: { onLogin: (username: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Sign in to your Kanban Board.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter any username"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
              aria-label="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter any password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              aria-label="Password"
            />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Note: For this demo, any username/password will work.</p>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};


// --- Main App Component ---
const App: React.FC = () => {
    // --- State Initialization ---
    const [user, setUser] = useState<{ name: string } | null>(() => {
        try {
            const savedUser = sessionStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const getInitialTheme = (): Theme => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme | null;
            if (savedTheme) return savedTheme;
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    };

    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [todos, setTodos] = useState<Todos>({ [ColumnId.TODO]: [], [ColumnId.IN_PROGRESS]: [], [ColumnId.DONE]: [] });

    const [filter, setFilter] = useState<FilterType>('all');
    const [draggedItem, setDraggedItem] = useState<TodoItem | null>(null);
    const [dragFromCol, setDragFromCol] = useState<ColumnId | null>(null);
    const [dragOverCol, setDragOverCol] = useState<ColumnId | null>(null);

    // --- Effects ---
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Could not save theme to localStorage", error);
        }
    }, [theme]);

    useEffect(() => {
        if (!user) return; 
        const getInitialTodos = () => {
             const defaultTodos: Todos = {
                [ColumnId.TODO]: [
                    { id: '1', text: 'Add a dark mode toggle', completed: true, dueDate: '2023-10-01' },
                    { id: '2', text: 'Implement user login', completed: false, dueDate: '2024-08-15' },
                ],
                [ColumnId.IN_PROGRESS]: [
                    { id: '3', text: 'Scope tasks to logged-in user', completed: false },
                ],
                [ColumnId.DONE]: [
                    { id: '4', text: 'Setup project with drag-and-drop', completed: true, dueDate: '2023-09-20' },
                ],
            };

            try {
                const savedTodos = localStorage.getItem(`todos_${user.name}`);
                return savedTodos ? JSON.parse(savedTodos) : defaultTodos;
            } catch (error) {
                console.error("Could not parse todos from localStorage", error);
                return defaultTodos;
            }
        }
        setTodos(getInitialTodos());
    }, [user]);

    useEffect(() => {
        if (!user || todos[ColumnId.TODO].length === 0) return; // Don't save if no user or initial empty state
        try {
            localStorage.setItem(`todos_${user.name}`, JSON.stringify(todos));
        } catch (error) {
            console.error("Could not save todos to localStorage", error);
        }
    }, [todos, user]);


    // --- Event Handlers ---
    const handleLogin = (username: string) => {
        const newUser = { name: username };
        setUser(newUser);
        try {
            sessionStorage.setItem('user', JSON.stringify(newUser));
        } catch (error) {
            console.error("Could not save user to sessionStorage", error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        try {
            sessionStorage.removeItem('user');
        } catch (error) {
            console.error("Could not remove user from sessionStorage", error);
        }
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleAddTodo = useCallback((text: string, columnId: ColumnId, dueDate?: string) => {
        const newTodo: TodoItem = {
            id: new Date().toISOString(),
            text,
            completed: columnId === ColumnId.DONE,
            dueDate,
        };
        setTodos(prev => ({
            ...prev,
            [columnId]: [...prev[columnId], newTodo],
        }));
    }, []);

    const handleToggleTodo = useCallback((id: string, columnId: ColumnId) => {
        setTodos(prev => ({
            ...prev,
            [columnId]: prev[columnId].map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
        }));
    }, []);

    const handleDeleteTodo = useCallback((id: string, columnId: ColumnId) => {
        setTodos(prev => ({
            ...prev,
            [columnId]: prev[columnId].filter(todo => todo.id !== id),
        }));
    }, []);

    const handleDragStart = (item: TodoItem, from: ColumnId) => {
        setDraggedItem(item);
        setDragFromCol(from);
    };
    
    const handleDragEnter = (overColumn: ColumnId) => {
        if (draggedItem) {
            setDragOverCol(overColumn);
        }
    };
    
    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragFromCol(null);
        setDragOverCol(null);
    };

    const handleDrop = (targetItem: TodoItem | null, toColumn: ColumnId) => {
        if (!draggedItem || !dragFromCol) {
            handleDragEnd();
            return;
        }

        const itemToMove = { 
            ...draggedItem, 
            completed: toColumn === ColumnId.DONE 
        };
        
        const newTodos = JSON.parse(JSON.stringify(todos));
        
        const sourceItems = newTodos[dragFromCol].filter((i: TodoItem) => i.id !== itemToMove.id);
        newTodos[dragFromCol] = sourceItems;

        const destItems = newTodos[toColumn];
        const dropIndex = targetItem ? destItems.findIndex((i: TodoItem) => i.id === targetItem.id) : destItems.length;
        destItems.splice(dropIndex, 0, itemToMove);
        
        setTodos(newTodos);
        handleDragEnd();
    };

    const filteredTodos = useMemo(() => {
        if (filter === 'all') {
            return todos;
        }
        const newTodos = {} as Todos;
        (Object.keys(todos) as ColumnId[]).forEach(columnId => {
            if (!todos[columnId]) {
              newTodos[columnId] = [];
              return;
            }
            newTodos[columnId] = todos[columnId].filter(todo => {
                if (filter === 'active') return !todo.completed;
                if (filter === 'completed') return todo.completed;
                return false;
            });
        });
        return newTodos;
    }, [todos, filter]);


    // --- Render Logic ---
    if (!user) {
        return <LoginForm onLogin={handleLogin} />;
    }

    const FilterControls = () => (
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
            {(['all', 'active', 'completed'] as FilterType[]).map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    filter === f
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-pressed={filter === f}
                >
                    {f}
                </button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
        <header className="max-w-7xl mx-auto mb-8">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                        Kanban Board
                    </h1>
                     <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                        Welcome, <span className="font-semibold">{user.name}</span>!
                    </p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                     <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Logout"
                    >
                        <LogoutIcon />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
        <FilterControls />
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[calc(100vh-18rem)]">
            <Column
                title="To Do"
                items={filteredTodos[ColumnId.TODO] || []}
                columnId={ColumnId.TODO}
                color="border-blue-500"
                onAdd={handleAddTodo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                isDraggingOver={dragOverCol === ColumnId.TODO}
            />
            <Column
                title="In Progress"
                items={filteredTodos[ColumnId.IN_PROGRESS] || []}
                columnId={ColumnId.IN_PROGRESS}
                color="border-yellow-500"
                onAdd={handleAddTodo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                isDraggingOver={dragOverCol === ColumnId.IN_PROGRESS}
            />
            <Column
                title="Done"
                items={filteredTodos[ColumnId.DONE] || []}
                columnId={ColumnId.DONE}
                color="border-green-500"
                onAdd={handleAddTodo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                isDraggingOver={dragOverCol === ColumnId.DONE}
            />
        </main>
        </div>
    );
};

export default App;