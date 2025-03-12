import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://your-api-base-url.com/api', // Replace with your API base URL
});

// Request interceptor to add token to headers if needed
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // Assuming you store your token in AsyncStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api; 