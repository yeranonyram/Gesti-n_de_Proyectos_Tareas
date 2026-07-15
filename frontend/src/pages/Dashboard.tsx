import { jwtDecode } from 'jwt-decode';
import { FaFolderOpen, FaTasks, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import type { JwtPayload } from '../types/jwt';

export default function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

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
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
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

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">

                  Proyectos

                </p>

                <h3 className="text-5xl font-bold mt-2">

                  0

                </h3>

              </div>

              <FaFolderOpen
                className="text-blue-600"
                size={50}
              />

            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">

                  Tareas

                </p>

                <h3 className="text-5xl font-bold mt-2">

                  0

                </h3>

              </div>

              <FaTasks
                className="text-green-600"
                size={50}
              />

            </div>

          </div>

        </div>

        {/* Acciones */}

        <div className="mt-10">

          <button
            onClick={() => navigate('/projects')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg"
          >
            Ver proyectos
          </button>

        </div>

      </main>

    </div>
  );
}