import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login({
        email,
        password,
      });

      console.log('Login exitoso');
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '60px auto',
      }}
    >
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {error && (
          <p
            style={{
              color: 'red',
            }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}