import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold hover:text-blue-400">
          Gestión Proyectos
        </Link>
        {user && (
          <>
            <Link to="/projects" className="hover:text-blue-400">Proyectos</Link>
            <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-300">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Iniciar sesión</Link>
            <Link to="/register" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;