import axios from 'axios';
import {HOST} from './apis';
import {useAppStore} from '../store';

export const apiClient = axios.create({
  baseURL: HOST,
});

apiClient.interceptors.request.use(
  async config => {
    try {
      const {token} = useAppStore.getState();

      if (token && config.baseURL?.startsWith(HOST)) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (config.method === 'get') {
        delete config.data;
      }

      return config;
    } catch (error) {
      return config;
    }
  },
  error => Promise.reject(error),
);
