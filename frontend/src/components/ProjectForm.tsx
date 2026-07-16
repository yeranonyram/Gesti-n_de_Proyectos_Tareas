import { useState } from 'react';
import projectService from '../services/project.service';
import type { CreateProjectDto } from '../types/project';

interface Props {
  onCreated: () => void;
}


export default function ProjectForm({ onCreated }: Props) {

  const [form, setForm] = useState<CreateProjectDto>({
    name: '',
    description: '',
  });


  const [loading, setLoading] = useState(false);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    try {

      setLoading(true);


      await projectService.create(form);


      // Limpiar formulario
      setForm({
        name: '',
        description: '',
      });


      // Avisar a Projects.tsx
      onCreated();


    } catch(error){

      console.error(error);

    } finally {

      setLoading(false);

    }

  }


  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-6 space-y-4"
    >


      <h2 className="text-2xl font-bold">
        Nuevo Proyecto
      </h2>


      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre del proyecto"
        className="w-full border rounded-lg p-3"
      />


      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full border rounded-lg p-3"
      />


      <button
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
      >

        {loading 
          ? 'Creando...' 
          : 'Crear Proyecto'
        }

      </button>


    </form>

  );
}