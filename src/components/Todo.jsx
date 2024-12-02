import React, { useState, useEffect } from 'react';
import { addTodo, fetchTasks, updateTask, deleteTasks } from '../api/todoApi';

// Function to format today's date as yyyy-mm-dd
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState({
    title: '',
    description: '',
    due_date: getTodayDate(),
    priority: 'medium',
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  // Ensure currentPage starts at 1
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // Default limit per page

  // Fetch tasks on mount and when currentPage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTasks({ limit, page: currentPage });
        const { data, totalData } = response.data;

        setTasks(data);

        // Calculate totalPages from the totalData and limit
        setTotalPages(Math.ceil(totalData / limit));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchData();
  }, [currentPage, limit]);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new task
  const addTask = async () => {
    if (taskInput.title.trim()) {
      try {
        const newTask = await addTodo(taskInput);
        setTasks([newTask.data, ...tasks]); // Add task at the top
        setTaskInput({
          title: '',
          description: '',
          due_date: getTodayDate(),
          priority: 'medium',
        });
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Update an existing task
  const updateExistingTask = async () => {
    if (editingTask) {
      try {
        const updatedTask = await updateTask(editingTask._id, taskInput);
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === updatedTask.data._id ? updatedTask.data : task))
        );
        setEditingTask(null);
        setTaskInput({
          title: '',
          description: '',
          due_date: getTodayDate(),
          priority: 'medium',
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  // Toggle task completion status
  const toggleCompletion = async (taskId) => {
    const task = tasks.find((task) => task._id === taskId);
    if (task) {
      const updatedTask = { ...task, status: task.status === 'completed' ? 'pending' : 'completed' };
      await updateTask(taskId, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    }
  };

  // Delete a single task
  const deleteTaskById = async (taskId) => {
    try {
      await deleteTasks([taskId]);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Select or unselect a task
  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Select or unselect all tasks
  const toggleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task._id));
    }
  };

  // Delete selected tasks
  const deleteSelectedTasks = async () => {
    try {
      await deleteTasks(selectedTasks);
      setTasks((prevTasks) => prevTasks.filter((task) => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
      setIsSelecting(false); // Revert to normal mode
    } catch (error) {
      console.error('Error deleting selected tasks:', error);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
    setTaskInput({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date,
      priority: task.priority,
    });
  };

  // Pagination handlers
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to determine priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'high':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          {editingTask ? 'Edit Task' : 'To-Do List'}
        </h1>

        {/* Task Form */}
        <div className="mb-6">
          <input
            type="text"
            name="title"
            value={taskInput.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded-lg mb-3"
          />
          <textarea
            name="description"
            value={taskInput.description}
            onChange={handleInputChange}
            placeholder="Description"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-lg mb-3"
          />
          <input
            type="date"
            name="due_date"
            value={taskInput.due_date}
            onChange={handleInputChange}
            min={getTodayDate()}
            className="w-full p-2 border border-gray-300 rounded-lg mb-3"
          />
          <select
            name="priority"
            value={taskInput.priority}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg mb-6"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          {editingTask ? (
            <button
              onClick={updateExistingTask}
              className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Task
            </button>
          ) : (
            <button
              onClick={addTask}
              className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Task
            </button>
          )}
        </div>

        {/* Select Tasks Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsSelecting(!isSelecting)}
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isSelecting ? 'Cancel Selection' : 'Select Tasks'}
          </button>
        </div>

        {/* Batch Delete Selected Tasks */}
        {isSelecting && selectedTasks.length > 0 && (
          <button
            onClick={deleteSelectedTasks}
            className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Selected Tasks
          </button>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Previous
          </button>
          <span className="mx-4 text-sm text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-4 mt-6">
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const taskKey = task._id || `task-${task.index}`;

              return (
                <li
                  key={taskKey}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-white'
                  } shadow-sm`}
                >
                  <div className="flex items-center space-x-3">
                    {isSelecting && (
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task._id)}
                        onChange={() => toggleTaskSelection(task._id)}
                        className="form-checkbox"
                      />
                    )}
                    <div
                      onClick={() => toggleCompletion(task._id)}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer flex justify-center items-center ${
                        task.status === 'completed' ? 'bg-green-500' : 'bg-white'
                      }`}
                    >
                      {task.status === 'completed' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                          <path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="flex gap-2">
                        <span className={`font-semibold ${task.status === 'completed' ? 'line-through' : ''}`}>
                          {task.title}
                        </span>
                        <span className={`text-xs w-fit py-1 px-2 mt-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </span>

                      <span className="text-sm text-gray-500">{task.description}</span>
                      <span className="text-xs text-gray-400">Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => startEditing(task)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTaskById(task._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      &#10005;
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <li>No tasks available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
