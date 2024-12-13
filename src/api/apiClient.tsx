import axios from 'axios';
import {HOST} from './apis';

export const apiClient = axios.create({
  baseURL: HOST,
  //   withCredentials: true,
});
