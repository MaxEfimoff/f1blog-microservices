import { IUser } from '../models/IUser';
import { makeAutoObservable } from 'mobx';
import AuthService from '../services/AuthService';
import { StringLiteralLike } from 'typescript';

export default class Store {
  user = {} as IUser;
  isAuth = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.data.token);
      this.setAuth(true);
    } catch (err) {
      console.log(err);
    }
  }

  async register(email: string, password: string, password2: string, name: string) {
    try {
      const response = await AuthService.register(email, password, password2, name);
      localStorage.setItem('token', response.data.data.token);
      this.setAuth(true);
    } catch (err) {
      console.log(err);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
    } catch (err) {
      console.log(err);
    }
  }
}
