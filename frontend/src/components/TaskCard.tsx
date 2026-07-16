import type { Task } from '../types/task';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: Props) {
  const statusColor = {
    pending: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
  };

  const priorityColor = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 border">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">
          {task.title}
        </h2>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              statusColor[task.status]
            }`}
          >
            {task.status}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              priorityColor[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>
      <p className="text-gray-600 mt-3">
        {task.description || 'Sin descripción'}
      </p>
      <div className="mt-5 flex justify-between">
        <span className="text-gray-400 text-sm">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : 'Sin fecha'}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(task)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}