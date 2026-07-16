import { useState, type FormEvent } from 'react';
import projectService from '../services/project.service';
import type { Project } from '../types/project';

interface Props {
  project: Project;
  onUpdated: () => void;
  onCancel: () => void;
}

export default function ProjectEditForm({
  project,
  onUpdated,
  onCancel,
}: Props) {
  const [name, setName] = useState(project.name);

  const [description, setDescription] =
    useState(project.description);

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    await projectService.update(
      project.id,
      {
        name,
        description,
      }
    );

    onUpdated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        shadow
        rounded-xl
        p-6
        space-y-4
      "
    >
      <h2 className="text-xl font-bold">
        Editar Proyecto
      </h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-3 w-full rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-3 w-full rounded"
      />

      <div className="flex gap-3">
        <button
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded
          "
        >
          Guardar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="
            bg-gray-400
            text-white
            px-4
            py-2
            rounded
          "
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}