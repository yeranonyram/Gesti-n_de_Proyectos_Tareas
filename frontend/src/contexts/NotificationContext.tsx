import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';

import { toast } from 'react-toastify';
import socket from '../services/socket.service';

const NotificationContext = createContext({});

interface Props {
  children: ReactNode;
}

export function NotificationProvider({ children }: Props) {
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('🟢 Conectado al servidor');
    });

    socket.on('disconnect', () => {
      console.log('🔴 Desconectado');
    });

    // =========================
    // PROYECTOS
    // =========================

    socket.on('projectCreated', (data) => {
      toast.success(`📁 Proyecto creado: ${data.project.name}`);

      window.dispatchEvent(
        new CustomEvent('projectCreated', {
          detail: data,
        }),
      );
    });

    // =========================
    // TAREAS
    // =========================

    socket.on('taskUpdated', (data) => {
      toast.info(`✏️ Tarea actualizada: ${data.title}`);

      window.dispatchEvent(
        new CustomEvent('taskUpdated', {
          detail: data,
        }),
      );
    });

    socket.on('taskCompleted', (data) => {
      toast.success(`✅ ${data.title} completada`);

      window.dispatchEvent(
        new CustomEvent('taskCompleted', {
          detail: data,
        }),
      );
    });

    socket.on('taskDeleted', (data) => {
      toast.error(`🗑️ Tarea eliminada`);

      window.dispatchEvent(
        new CustomEvent('taskDeleted', {
          detail: data,
        }),
      );
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');

      socket.off('projectCreated');
      socket.off('taskUpdated');
      socket.off('taskCompleted');
      socket.off('taskDeleted');

      socket.disconnect();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}