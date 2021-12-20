import api from '../http';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';

export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>('/users/login', { email, password });
  }

  static async register(
    email: string,
    password: string,
    password2: string,
    name: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>('/users/signup', { email, password, password2, name });
  }

  static async logout(): Promise<void> {
    return api.post('/logout');
  }
}
