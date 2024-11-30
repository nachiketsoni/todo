import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://todo-server-nine-psi.vercel.app/api',  // Your backend API
    headers: {
      'Content-Type': 'application/json',
      
    },

    withCredentials: true,  // Send cookies with the request (if needed, e.g., for session authentication)
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
