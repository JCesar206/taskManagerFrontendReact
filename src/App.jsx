import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import * as tasksApi from './api/tasks.js';
import AuthForm from './components/AuthForm.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskItem from './components/TaskItem.jsx';

const FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'done', label: 'Hechas' },
];

function TaskBoard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setError('');
    try {
      setTasks(await tasksApi.getTasks(filter));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (data) => {
    await tasksApi.createTask(data);
    await loadTasks();
  }

  const handleUpdate = async (id, data) => {
    await tasksApi.updateTask(id, data);
    await loadTasks();
  }

  const handleDelete = async (id) => {
    await tasksApi.deleteTask(id);
    await loadTasks();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestor de Tareas</h1>
        <div className="flex items-center gap-3 text-sm">
          <span>{user.email}</span>
          <button onClick={logout} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 cursor-pointer">Salir</button>
        </div>
      </header>

      <TaskForm onCreate={handleCreate} />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`rounded px-3 py-1 text-sm cursor-pointer ${
              filter === f.value ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center justify-between rounded bg-red-100 p-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={loadTasks} className="underline cursor-pointer">Reintentar</button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No hay tareas para mostrar.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8">Cargando...</p>
  if (!user) return <AuthForm />
  return <TaskBoard />
}