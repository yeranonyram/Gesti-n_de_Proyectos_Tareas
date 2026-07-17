import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  FaFolderOpen,
  FaTasks,
  FaSignOutAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import type { JwtPayload } from '../types/jwt';
import projectService from '../services/project.service';
import socket from '../services/socket.service';
import statsService, { type TaskStats } from '../services/stats.service';

export default function Dashboard() {
  const navigate = useNavigate();

  const [totalProjects, setTotalProjects] = useState(0);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadStats() {
      try {
        const projectsResponse =
          await projectService.getProjects();

        setTotalProjects(projectsResponse.total);

        const tasksResponse =
          await statsService.getTaskStats();

        setTaskStats(tasksResponse);
      } catch (error) {
        console.error(
          'Error cargando estadísticas:',
          error
        );
      }
    }
    loadStats();
  }, []);


  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('🟢 Conectado');
    });

    return () => {
      socket.disconnect();
    };

  }, []);
  let email = '';
  if (token) {
    const user = jwtDecode<JwtPayload>(token);
    email = user.email;
  }
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <header className="bg-slate-900 text-white shadow">

        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Gestión de Proyectos
            </h1>

            <p className="text-slate-300 mt-1">
              Panel Principal
            </p>

          </div>


          <button
            onClick={logout}
            className="
              flex
              items-center
              gap-2
              bg-red-600
              hover:bg-red-700
              px-4
              py-2
              rounded-lg
              transition
            "
          >

            <FaSignOutAlt />

            Cerrar sesión

          </button>

        </div>

      </header>



      {/* Contenido */}

      <main className="max-w-7xl mx-auto p-8">


        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-800">

            👋 Bienvenido

          </h2>


          <p className="text-slate-600 mt-2">

            {email}

          </p>

        </div>



        {/* Cards */}

        <div className="grid md:grid-cols-4 gap-6">


          {/* Proyectos */}

          <div className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Proyectos
                </p>


                <h3 className="text-5xl font-bold mt-2">

                  {totalProjects}

                </h3>

              </div>


              <FaFolderOpen
                className="text-blue-600"
                size={50}
              />

            </div>

          </div>



          {/* Tareas */}

          <div className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Tareas
                </p>


                <h3 className="text-5xl font-bold mt-2">

                  {
                    taskStats?.total ?? 0
                  }

                </h3>

              </div>


              <FaTasks
                className="text-green-600"
                size={50}
              />

            </div>

          </div>



          {/* Pendientes */}

          <div className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Pendientes
                </p>


                <h3 className="text-5xl font-bold mt-2">

                  {
                    taskStats?.byStatus.pending ?? 0
                  }

                </h3>

              </div>


              <FaClock
                className="text-yellow-500"
                size={50}
              />

            </div>

          </div>



          {/* Completadas */}

          <div className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Completadas
                </p>


                <h3 className="text-5xl font-bold mt-2">

                  {
                    taskStats?.byStatus.completed ?? 0
                  }

                </h3>

              </div>


              <FaCheckCircle
                className="text-green-600"
                size={50}
              />

            </div>

          </div>



          {/* Vencidas */}

          <div className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  Vencidas
                </p>


                <h3 className="text-5xl font-bold mt-2">

                  {
                    taskStats?.overdue ?? 0
                  }

                </h3>

              </div>


              <FaExclamationTriangle
                className="text-red-600"
                size={50}
              />

            </div>

          </div>


        </div>



        {/* Acciones */}

        <div className="mt-10">


          <button
            onClick={() => navigate('/projects')}
            className="
              bg-slate-900
              hover:bg-slate-800
              text-white
              px-6
              py-3
              rounded-lg
            "
          >

            Ver proyectos

          </button>


        </div>


      </main>


    </div>
  );
}