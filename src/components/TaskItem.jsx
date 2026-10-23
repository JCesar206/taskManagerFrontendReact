import { useState } from 'react';

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  done: 'Hecha',
};

const PRIORITY_STYLES = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const PRIORITY_LABELS = { low: 'Baja', medium: 'Media', high: 'Alta' };

// "2026-10-17" -> "17/10/2026" (sin new Date, para evitar el desfase de zona horaria)
const formatDate = (iso) => {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  // Ejecuta una acción y devuelve true si salió bien
  const run = async (action) => {
    setError('');
    setBusy(true);
    try {
      await action();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  const handleStatusChange = (e) => run(() => onUpdate(task.id, { status: e.target.value }));

  const handleDelete = () => {
    if (!window.confirm(`¿Eliminar "${task.title}"?`)) return
    run(() => onDelete(task.id));
  }

  const startEdit = () => {
    setForm({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      due_date: task.due_date ?? '',
    })
    setError('');
    setEditing(true);
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    const ok = await run(() =>
      onUpdate(task.id, {
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        due_date: form.due_date || null,
      }),
    )
    if (ok) setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-lg bg-white p-4 shadow">
        <form onSubmit={handleSave} className="space-y-3">
          {error && <p className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}

          <input name="title" required maxLength={150} value={form.title} onChange={handleChange}
            className="w-full rounded border p-2"/>

          <textarea name="description" rows={2} placeholder="Descripción (opcional)"
            value={form.description} onChange={handleChange} className="w-full rounded border p-2" />

          <div className="flex gap-3">
            <select name="priority" value={form.priority} onChange={handleChange}
              className="flex-1 rounded border p-2">
              <option value="low">Prioridad baja</option>
              <option value="medium">Prioridad media</option>
              <option value="high">Prioridad alta</option>
            </select>

            <input type="date" name="due_date" value={form.due_date}
              onChange={handleChange} className="flex-1 rounded border p-2" />
          </div>

          <div className="flex gap-2">
            <button disabled={busy} className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
              {busy ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setEditing(false)} disabled={busy}
              className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50 cursor-pointer">Cancelar</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-lg bg-white p-4 shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`font-semibold ${task.status === 'done' ? 'text-gray-400 line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && <p className="mt-1 text-sm text-gray-600">{task.description}</p>}
        </div>

        <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {error && <p className="mt-2 rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <select value={task.status} onChange={handleStatusChange} disabled={busy}
            className="rounded border p-1 disabled:opacity-50">
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {task.due_date && <span className="text-gray-500">Vence: {formatDate(task.due_date)}</span>}
        </div>

        <div className="flex gap-3">
          <button onClick={startEdit} disabled={busy}
            className="text-yellow-600 font-semibold hover:underline disabled:opacity-50 cursor-pointer">Editar</button>
          <button onClick={handleDelete} disabled={busy} className="text-red-600 font-semibold hover:underline disabled:opacity-50 cursor-pointer">Eliminar</button>
        </div>
      </div>
    </li>
  );
}