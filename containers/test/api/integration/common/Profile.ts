import axios from 'axios';
import { ENV } from '../environment';

const requestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosConfig = {
  baseURL: `${ENV}/api/v1/profiles`,
  validateStatus: () => true,
};

const axiosAPIClient = axios.create(axiosConfig);

class Profile {
  static async fetchAllProfiles(config: object = requestConfig) {
    return axiosAPIClient.get('/all', config);
  }

  static async fetchSubscribedProfiles(config: object = requestConfig) {
    return axiosAPIClient.get('/subscribed-profiles', config);
  }

  static async fetchSubscribers(config: object = requestConfig) {
    return axiosAPIClient.get('/subscribers', config);
  }

  static async createProfile(data: object, config: object = requestConfig) {
    return axiosAPIClient.post('/', data, config);
  }

  static async fetchCurrentProfile(config: object = requestConfig) {
    return axiosAPIClient.get('/current', config);
  }

  static async fetchProfileByHandle(config: object = requestConfig, handle: string) {
    return axiosAPIClient.get(`/handle/${handle}`, config);
  }

  static async fetchProfileById(config: object = requestConfig, id: string) {
    return axiosAPIClient.get(`/${id}`, config);
  }

  static async subscribeToProfile(data: object, config: object = requestConfig, id: string) {
    return axiosAPIClient.post(`/subscribe/${id}`, data, config);
  }

  static async unsubscribeFromProfile(data: object, config: object = requestConfig, id: string) {
    return axiosAPIClient.patch(`/unsubscribe/${id}`, data, config);
  }

  static async updateProfile(data: object, config: object = requestConfig) {
    return axiosAPIClient.patch('/', data, config);
  }

  static async deleteProfile(config: object = requestConfig) {
    return axiosAPIClient.delete('/', config);
  }
}

export { Profile };
