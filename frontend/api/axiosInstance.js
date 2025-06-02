import axios from 'axios';

import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  console.log("🚀 Axios Request:", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

export default api;