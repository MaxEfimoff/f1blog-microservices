import axios from 'axios';
import { ENV } from '../environment';

const requestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosConfig = {
  baseURL: `${ENV}/api/v1/organization`,
  validateStatus: () => true,
};

const axiosAPIClient = axios.create(axiosConfig);

class Organization {
  static async fetchOrganization(config: object = requestConfig) {
    return axiosAPIClient.get('/', config);
  }

  static async createOrganization(data: object, config: object = requestConfig) {
    return axiosAPIClient.post('/', data, config);
  }

  static async updateOrganization(data: object, config: object = requestConfig, id: string) {
    return axiosAPIClient.patch(`/${id}`, data, config);
  }
}

export { Organization };
