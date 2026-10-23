import { useState } from 'react';

const EMPTY = { title: '', description: '', priority: 'medium', due_date: '' };

export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onCreate({
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        due_date: form.due_date || null,
      });
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow">
      <h2 className="font-semibold">Nueva tarea</h2>
      
			{error && <p className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}

      <input name="title" required maxLength={150} placeholder="Título" value={form.title}
        onChange={handleChange} className="w-full rounded border p-2" />

      <textarea name="description" placeholder="Descripción (opcional)" value={form.description}
        onChange={handleChange} rows={2} className="w-full rounded border p-2" />

      <div className="flex gap-3">
        <select name="priority" value={form.priority} onChange={handleChange}
          className="flex-1 rounded border p-2">
          <option value="low">Prioridad baja</option>
          <option value="medium">Prioridad media</option>
          <option value="high">Prioridad alta</option>
        </select>

        <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="flex-1 rounded border p-2"/>
      </div>

      <button disabled={busy}
        className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{busy ? 'Guardando...' : 'Agregar tarea'}</button>
    </form>
  );
}