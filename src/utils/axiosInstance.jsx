import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Update with your API base URL
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.headers) {
      const token = localStorage.getItem('accessToken'); // Example: token from local storage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.log('Unauthorized, please log in');
        // Handle logout or token refresh logic here
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
