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
  baseURL: `${ENV}/api/v1/profiles`,
  validateStatus: () => true,
};

const axiosAPIClient = axios.create(axiosConfig);

class Profile {
  static async fetchAllProfiles(config: object = requestConfig) {
    return axiosAPIClient.get('/all', config);
  }
}

export { Profile };
