import { useEffect, useState } from 'react';
import projectService from '../services/project.service';
import type { Project } from '../types/project';
import ProjectForm from '../components/ProjectForm';
import ProjectCard from '../components/ProjectCard';
import ProjectEditForm from '../components/ProjectEditForm';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm(
      '¿Eliminar proyecto?'
    );

    if (!confirmDelete) return;

    try {
      await projectService.delete(id);
      loadProjects();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
  }

  if (loading) {
    return (
      <h1 className="text-center mt-10 text-2xl">
        Cargando proyectos...
      </h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold">
            Mis proyectos
          </h1>

          <p className="text-gray-500 mt-2">
            Administra todos tus proyectos.
          </p>
        </div>


        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProject(null);
          }}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          Nuevo Proyecto
        </button>

      </div>


      {showForm && (
        <ProjectForm
          onCreated={() => {
            setShowForm(false);
            loadProjects();
          }}
        />
      )}



      {editingProject && (
        <ProjectEditForm
          project={editingProject}

          onUpdated={() => {
            setEditingProject(null);
            loadProjects();
          }}

          onCancel={() => {
            setEditingProject(null);
          }}
        />
      )}



      {projects.length === 0 ? (

        <p>
          No tienes proyectos.
        </p>

      ) : (

        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-3 
          gap-6
        ">

          {projects.map((project) => (

            <ProjectCard

              key={project.id}

              project={project}

              onDelete={handleDelete}

              onEdit={handleEdit}

            />

          ))}

        </div>

      )}

    </div>
  );
}