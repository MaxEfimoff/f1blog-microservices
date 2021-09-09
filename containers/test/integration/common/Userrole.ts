import axios from 'axios';
import { ENV } from '../environment';

const requestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosConfig = {
  baseURL: `${ENV}/api/v1/users`,
  validateStatus: () => true,
};

const axiosAPIClient = axios.create(axiosConfig);

class Userroles {
  static async fetchAllUserRoles() {
    return axiosAPIClient.get('/all-user-roles');
  }

  static async createUserRole(data: object, config: object = requestConfig) {
    return axiosAPIClient.post('/create-user-role', data, config);
  }

  static async assignRoleToUser(id: any, role: string, config: object = requestConfig) {
    return axiosAPIClient.post(`${id}/assign-role-to-user/${role}`, config);
  }

  static async fetchUsersByUserrole(role: string) {
    return axiosAPIClient.get(`/users-by-userrole/${role}`);
  }
}

export { Userroles };
