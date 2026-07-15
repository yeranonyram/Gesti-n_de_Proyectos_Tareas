import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login({
        email,
        password,
      });

      navigate('/dashboard');
      
    } catch (error) {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Gestor de Proyectos
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Inicia sesión en tu cuenta
        </p>


        <form onSubmit={handleSubmit} className="space-y-5">


          <div>
            <label className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="usuario@email.com"
              className="
                w-full
                px-4
                py-2
                border
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />
          </div>


          <div>

            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="********"
              className="
                w-full
                px-4
                py-2
                border
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />

          </div>


          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-blue-600
              text-white
              py-3
              rounded-lg
              font-semibold
              hover:bg-blue-700
              transition
              disabled:opacity-50
            "
          >

            {loading 
              ? 'Ingresando...' 
              : 'Iniciar sesión'
            }

          </button>


        </form>

      </div>

    </div>
  );
}