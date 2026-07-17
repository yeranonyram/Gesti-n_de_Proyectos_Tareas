import api from '../api/client';

import type {
  CreateProjectDto,
  ProjectsResponse,
  Project,
} from '../types/project';

class ProjectService {
  async getProjects(
    page = 1,
    limit = 10,
    search = '',
  ): Promise<ProjectsResponse> {
    const response = await api.get('/projects', {
      params: {
        page,
        limit,
        search,
      },
    });

    return response.data;
  }

  async getProject(id: number): Promise<Project> {
    const response = await api.get(`/projects/${id}`);

    return response.data;
  }

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await api.post('/projects', data);

    return response.data;
  }

    async update(
    id:number,
    data:CreateProjectDto
    ){

    const response =
    await api.patch(
    `/projects/${id}`,
    data
    );


    return response.data;

}

  async delete(id: number) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
}

export default new ProjectService();