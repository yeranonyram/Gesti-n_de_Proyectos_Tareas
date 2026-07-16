import AppRouter from './routes/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
        />

      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;