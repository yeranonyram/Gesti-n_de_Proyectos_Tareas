import api from '../api/client';
import type { LoginDto, LoginResponse } from '../types/auth';

class AuthService {

  async login(data: LoginDto): Promise<LoginResponse> {

    const response = await api.post<LoginResponse>(
      '/auth/login',
      data
    );

    return response.data;
  }

}

export default new AuthService();