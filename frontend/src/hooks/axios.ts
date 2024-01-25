import axios from 'axios';

// Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default instance;
