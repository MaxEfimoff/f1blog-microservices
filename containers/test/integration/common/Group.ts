import axios from 'axios';
import { ENV } from '../environment';

const requestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosConfig = {
  baseURL: `${ENV}/api/v1/groups`,
  validateStatus: () => true,
};

const axiosAPIClient = axios.create(axiosConfig);

class Group {
  static async fetchAllGroupsInTeam(config: object = requestConfig, id: string) {
    return axiosAPIClient.get(`/teams/${id}`, config);
  }

  static async fetchGroupInTeam(config: object = requestConfig, id: string, groupId: string) {
    return axiosAPIClient.get(`/team/${id}/group/${groupId}`, config);
  }

  static async fetchMyGroups(config: object = requestConfig, id: string) {
    return axiosAPIClient.get(`/my/team/${id}`, config);
  }

  static async createGroup(data: object, config: object = requestConfig, id: string) {
    return axiosAPIClient.post(`/team/${id}`, data, config);
  }

  static async joinGroup(
    data: object,
    config: object = requestConfig,
    id: string,
    groupId: string,
  ) {
    return axiosAPIClient.post(`/join-team/${id}/group/${groupId}`, data, config);
  }

  static async leaveGroup(
    data: object,
    config: object = requestConfig,
    id: string,
    groupId: string,
  ) {
    return axiosAPIClient.post(`/leave-team/${id}/group/${groupId}`, data, config);
  }

  // static async updateTeam(data: object, config: object = requestConfig, id: string) {
  //   return axiosAPIClient.patch(`/${id}`, data, config);
  // }

  // static async deleteUserFromTeam(
  //   config: object = requestConfig,
  //   id: string,
  //   deleteuserid: string,
  // ) {
  //   return axiosAPIClient.delete(`/${id}/user/${deleteuserid}`, config);
  // }

  static async deleteGroup(config: object = requestConfig, id: string, groupId: string) {
    return axiosAPIClient.delete(`team/${id}/group/${groupId}`, config);
  }
}

export { Group };
