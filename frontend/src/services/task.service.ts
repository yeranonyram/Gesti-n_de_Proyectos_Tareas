import api from '../api/client';
export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

class TaskService {
  async getTasks(projectId: number) {
    const response = await api.get(
      `/projects/${projectId}/tasks`
    );

    return response.data;
  }

  async getTask(
    projectId: number,
    taskId: number,
  ) {
    const response = await api.get(
      `/projects/${projectId}/tasks/${taskId}`
    );

    return response.data;
  }

  async createTask(
    projectId: number,
    data: CreateTaskDto,
  ) {
    const response = await api.post(
      `/projects/${projectId}/tasks`,
      data,
    );

    return response.data;
  }

  async updateTask(
    projectId: number,
    taskId: number,
    data: UpdateTaskDto,
  ) {
    const response = await api.patch(
      `/projects/${projectId}/tasks/${taskId}`,
      data,
    );

    return response.data;
  }

  async deleteTask(
    projectId: number,
    taskId: number,
  ) {
    await api.delete(
      `/projects/${projectId}/tasks/${taskId}`,
    );
  }

  removeTask(
    projectId: number,
    id: number,
  ) {
    return api.delete(
      `/projects/${projectId}/tasks/${id}`
    );
  }
}

export default new TaskService();