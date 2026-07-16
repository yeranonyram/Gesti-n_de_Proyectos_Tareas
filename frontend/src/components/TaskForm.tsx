import { useEffect, useState } from 'react';
import type { CreateTaskDto } from '../services/task.service';
import type { Task } from '../types/task';

interface Props {
  onSubmit: (data: CreateTaskDto) => Promise<void>;
  task?: Task | null;
}

export default function TaskForm({ onSubmit, task }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setStatus(task.status);

    if (task.dueDate) {
      setDueDate(task.dueDate.substring(0, 10));
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('pending');
    setDueDate('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 mb-8"
    >
      <h2 className="text-xl font-bold mb-6">
        Nueva tarea
      </h2>

      <input
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <select
          className="border rounded-lg p-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>

        <select
          className="border rounded-lg p-3"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>

        <input
          type="date"
          className="border rounded-lg p-3"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        {task ? 'Actualizar tarea' : 'Crear tarea'}
      </button>
    </form>
  );
}