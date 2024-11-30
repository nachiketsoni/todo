import axiosInstance from '../utils/axiosInstance';


export const signUp = async (data) => {
    try {
      const response = await axiosInstance.post('/user/signup', data);
      return response.data;
    } catch (error) {
      console.error("Error adding task", error);
      throw error;
    }
  };
export const login = async (data) => {
    try {
      const response = await axiosInstance.post('/user/login', data);
      return response.data;
    } catch (error) {
      console.error("Error adding task", error);
      throw error;
    }
  };