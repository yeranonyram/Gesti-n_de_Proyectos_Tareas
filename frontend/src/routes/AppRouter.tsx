import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}