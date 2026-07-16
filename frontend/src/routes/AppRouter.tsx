import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetail';

export default function AppRouter() {
  return (
        <Routes>

        <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
        />

        <Route 
            path="/login" 
            element={<Login />} 
        />

        <Route 
            path="/dashboard" 
              element={
                <ProtectedRoute>
                <Dashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="/projects"
            element={
                <ProtectedRoute>
                <Projects/>
                </ProtectedRoute>    
            }
        />

        <Route
            path='/projects/:id'
            element={
                <ProtectedRoute>
                <ProjectDetails/>
                </ProtectedRoute>
            }
        />

        <Route 
            path="*" 
            element={<h1>404 - Página no encontrada</h1>} 
        />

        </Routes>
  );
}