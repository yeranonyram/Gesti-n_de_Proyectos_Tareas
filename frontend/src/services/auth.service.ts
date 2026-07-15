import api from '../api/client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login(data: LoginDto) {
    return api.post('/auth/login', data);
  },

  register(data: RegisterDto) {
    return api.post('/auth/register', data);
  },

  me() {
    return api.get('/users/me');
  },
};