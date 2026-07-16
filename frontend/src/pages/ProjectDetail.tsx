import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import taskService from '../services/task.service';
import type { Task } from '../types/task';
import type { CreateTaskDto } from '../services/task.service';

export default function ProjectDetail() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      const response = await taskService.getTasks(Number(id));
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [id]);

  const handleSubmitTask = async (data: CreateTaskDto) => {
    if (selectedTask) {
      await taskService.updateTask(
        Number(id),
        selectedTask.id,
        data
      );

      setSelectedTask(null);
    } else {
      await taskService.createTask(
        Number(id),
        data
      );
    }

    await loadTasks();
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Eliminar tarea?')) return;

    await taskService.deleteTask(
      Number(id),
      taskId
    );

    await loadTasks();
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
  };

  if (loading) {
    return (
      <div className="p-8">
        Cargando tareas...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold">
        Tareas del proyecto
      </h1>

      <p className="text-gray-500 mb-8">
        Proyecto #{id}
      </p>

      <TaskForm
        task={selectedTask}
        onSubmit={handleSubmitTask}
      />

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          No existen tareas.
        </div>
      ) : (
        <div className="grid gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}