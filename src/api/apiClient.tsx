import axios from 'axios';
import {HOST} from './apis';

export const apiClient = axios.create({
  baseURL: HOST,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});
