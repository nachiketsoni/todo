import axiosInstance from '../utils/axiosInstance';

export const addTodo = async (taskData) => {
  try {
    const response = await axiosInstance.post('/task', taskData);
    return response.data;
  } catch (error) {
    console.error("Error adding task", error);
    throw error;
  }
};

export const fetchTasks = async ({ page, limit }) => {
  try {
    const response = await axiosInstance.get('/task', {
      params: {
        limit: limit ?? 5,
        currentPage:page?? 1,
        'sort[_id]': -1,  // Special character in the query key (sorting by _id)
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);  // Handle error appropriately
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
    // Ensure we exclude the _id and other internal fields that are not allowed
    const { title, description, due_date, priority, status } = taskData;
    const taskPayload = { title, description, due_date, priority, status };
  
    try {
      const response = await axiosInstance.put(`/task/${taskId}`, taskPayload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  export const fetchTaskById = async (taskId) => {
    try {
      const response = await axiosInstance.get(`/task/${taskId}`);
      return response.data;  // Return the fetched task data
    } catch (error) {
      console.error('Error fetching task:', error);  // Handle error appropriately
      throw error;
    }
  };
// API to delete multiple tasks by their IDs
export const deleteTasks = async (taskIds) => {
    try {
      const response = await axiosInstance.delete('/task', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ids: taskIds, // Sending the IDs of tasks to be deleted
        },
      });
  
      console.log('Tasks deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting tasks:', error);
      throw error;
    }
  };
  