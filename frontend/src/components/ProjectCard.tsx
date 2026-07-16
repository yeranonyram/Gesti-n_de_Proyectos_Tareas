import { useNavigate } from 'react-router-dom';
import type { Project } from '../types/project';

interface Props {
  project: Project;
  onDelete: (id: number) => void;
  onEdit: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onDelete,
  onEdit,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-white
        shadow-md
        rounded-xl
        p-5
        border
        hover:shadow-lg
        transition
      "
    >
      <h2
        className="
          text-xl
          font-bold
          mb-2
        "
      >
        {project.name}
      </h2>

      <p
        className="
          text-gray-600
          mb-4
        "
      >
        {project.description || 'Sin descripción'}
      </p>

      <div
        className="
          flex
          justify-between
          items-center
        "
      >
        <span
          className="
            text-sm
            text-gray-400
          "
        >
          {new Date(project.createdAt).toLocaleDateString()}
        </span>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="
              bg-blue-600
              text-white
              px-4
              py-2
              rounded-lg
              hover:bg-blue-700
            "
          >
            Ver tareas
          </button>

          <button
            onClick={() => onEdit(project)}
            className="
              bg-yellow-500
              text-white
              px-4
              py-2
              rounded-lg
              hover:bg-yellow-600
            "
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(project.id)}
            className="
              bg-red-500
              text-white
              px-4
              py-2
              rounded-lg
              hover:bg-red-600
            "
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}