export interface Project {
  id: number;
  name: string;
  description?: string;

  createdAt: string;
  updatedAt: string;

  userId: number;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}