import axios from 'axios';
import { ENV } from '../environment';

const requestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosConfig = {
  baseURL: `${ENV}/api/v1/teams`,
  validateStatus: () => true,
};

const axiosAPIClient = axios.create(axiosConfig);

class Team {
  static async fetchAllTeams(config: object = requestConfig) {
    return axiosAPIClient.get('/', config);
  }

  static async fetchMyTeams(config: object = requestConfig) {
    return axiosAPIClient.get('/my', config);
  }

  static async fetchAllProfiles(config: object = requestConfig) {
    return axiosAPIClient.get('/profiles', config);
  }

  static async fetchTeamById(config: object = requestConfig, id: string) {
    return axiosAPIClient.get(`/${id}`, config);
  }

  static async fetchTeamByTitle(config: object = requestConfig, title: string) {
    return axiosAPIClient.get(`/title/${title}`, config);
  }

  static async fetchAllUsersInTeam(config: object = requestConfig, id: string) {
    return axiosAPIClient.get(`/${id}/all`, config);
  }

  static async createTeam(data: object, config: object = requestConfig) {
    return axiosAPIClient.post('/', data, config);
  }

  static async joinTeam(data: object, config: object = requestConfig, id: string) {
    return axiosAPIClient.post(`/${id}/join`, data, config);
  }

  static async leaveTeam(data: object, config: object = requestConfig, id: string) {
    return axiosAPIClient.post(`/${id}/leave`, data, config);
  }

  static async updateTeam(data: object, config: object = requestConfig, id: string) {
    return axiosAPIClient.patch(`/${id}`, data, config);
  }

  static async deleteUserFromTeam(
    config: object = requestConfig,
    id: string,
    deleteuserid: string,
  ) {
    return axiosAPIClient.delete(`/${id}/user/${deleteuserid}`, config);
  }

  static async deleteTeam(config: object = requestConfig, id: string) {
    return axiosAPIClient.delete(`/${id}`, config);
  }
}

export { Team };
