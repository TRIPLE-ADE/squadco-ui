import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://ikigai-backend-74qi.onrender.com/', // Replace with your API base URL
});

// Request interceptor to add token to headers if needed
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.url) {
      config.url += config.url.includes('?') ? `&token=${token}` : `?token=${token}`;
    }
    return config;
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
 async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await AsyncStorage.removeItem("token");
      // Redirect user to login screen
      console.error('API Error:', error);
    }
    // Handle error globally
    return Promise.reject(error);    
  }
);

export default api; 