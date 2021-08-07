import axios from 'axios';
import faker from 'faker';
import { ENV } from '../environment';

interface UserInterface {
  name: string;
  email: string;
  password: string;
  password2: string;
}

const randomUserData: UserInterface = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: '123456',
  password2: '123456',
};

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

class User {
  name: string;
  email: string;
  password: string;
  password2: string;

  static async registerRandomUser(data: object = randomUserData, config: object = requestConfig) {
    return axiosAPIClient.post('/signup', data, config);
  }

  static async fetchAllConfirmationHashes() {
    return axiosAPIClient.get('/all-confirmation-hashes');
  }

  static async activateUser(confirmationHash: string) {
    return axiosAPIClient.patch(`/${confirmationHash}/activate`);
  }

  static async loginUser(data: object, config: object = requestConfig) {
    return axiosAPIClient.post(`/login`, data, config);
  }

  static async fetchCurrentUser(config: object = requestConfig) {
    return axiosAPIClient.get(`/current`, config);
  }

  static async fetchAllUsers(config: object = requestConfig) {
    return axiosAPIClient.get(`/all`, config);
  }

  static async resendConfirmationHash(data: object, config: object = requestConfig) {
    return axiosAPIClient.patch(`/hash/resend`, data, config);
  }

  static async resetPasswordRequest(data: object, config: object = requestConfig) {
    return axiosAPIClient.post(`/reset-password`, data, config);
  }

  static async fetchAllResetPasswordHashes() {
    return axiosAPIClient.get(`/all-reset-password-hashes`);
  }

  static async changePassword(
    changePasswordHash: string,
    data: object,
    config: object = requestConfig,
  ) {
    return axiosAPIClient.patch(`/${changePasswordHash}/reset-password`, data, config);
  }

  static async changeEmailRequest(config: object = requestConfig) {
    return axiosAPIClient.post(`/change-email`, config);
  }

  static async changeEmail(changeEmailHash: string, data: object, config: object = requestConfig) {
    return axiosAPIClient.patch(`/${changeEmailHash}/change-email`, data, config);
  }

  static async fetchAllChangeEmailHashes() {
    return axiosAPIClient.get(`/all-change-email-hashes`);
  }
}

export { User };
