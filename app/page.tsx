"use client";
import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./actions/taskActions";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added error state
  const [success, setSuccess] = useState<string | null>(null); // Added success state

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError(null); // Reset errors on each fetch
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        setError("Failed to fetch tasks. Please try again.");
      }
      setLoading(false);
    }
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null); // Reset errors on each creation attempt
    try {
      const task = await createTask(newTask.title, newTask.description, newTask.dueDate);
      setTasks(prev => [...prev, task]); // Update UI state
      setNewTask({ title: "", description: "", dueDate: "" });
      setSuccess("Task created successfully!");
    } catch (error) {
      setError("Failed to create task. Please try again.");
    }
    setLoading(false);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    setLoading(true);
    setError(null); // Reset errors
    try {
      const updatedTask = await updateTask(id, !completed);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      setSuccess("Task updated successfully!");
    } catch (error) {
      setError("Failed to update task. Please try again.");
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    setError(null); // Reset errors
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id)); // Remove from UI state
      setSuccess("Task deleted successfully!");
    } catch (error) {
      setError("Failed to delete task. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="p-5 min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg p-8 w-full max-w-md border border-white border-opacity-30">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Task Manager</h1>

        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {/* Task Creation Form */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 rounded-md bg-white bg-opacity-30 text-white placeholder-white border border-white border-opacity-40 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-2 rounded-md bg-white bg-opacity-30 text-white placeholder-white border border-white border-opacity-40 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="w-full p-2 rounded-md bg-white bg-opacity-30 text-white placeholder-white border border-white border-opacity-40 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            onClick={handleCreateTask}
            className="w-full mt-4 bg-white bg-opacity-40 hover:bg-opacity-60 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <p className="text-white text-center">Loading tasks...</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map(task => (
              <li key={task._id} className="flex justify-between items-center bg-white bg-opacity-30 p-3 rounded-md">
                <span className="text-white">{task.title} - {task.completed ? "✅" : "❌"}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleToggleComplete(task._id, task.completed)}
                    className="text-white bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-600"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-white bg-red-500 px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
