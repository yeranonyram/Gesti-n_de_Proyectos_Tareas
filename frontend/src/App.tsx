import { useEffect } from 'react';
import { authService } from './services/auth.service';

function App() {
  useEffect(() => {
    authService
      .me()
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <h1>Frontend conectado 🚀</h1>;
}

export default App;