"use server";

import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task"; // Removed { ITask }, as it's not needed

// Fetch tasks
export const getTasks = async () => {
  try {
    await connectDB();
    const tasks = await Task.find().lean(); // Convert MongoDB docs to plain objects
    return JSON.parse(JSON.stringify(tasks)); // Ensure JSON serialization for API consumption
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks"); // Throw error for proper error handling
  }
};

// Create a new task
export const createTask = async (title: string, description: string, dueDate: string) => {
  try {
    if (!title || !description || !dueDate) {
      throw new Error("Title, description, and due date are required");
    }

    await connectDB();
    const task = await Task.create({ title, description, dueDate, completed: false });
    return JSON.parse(JSON.stringify(task)); // Return JSON-compatible task
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task"); // Throw error for proper error handling
  }
};

// Update task completion status
export const updateTask = async (id: string, completed: boolean) => {
  try {
    if (!id) {
      throw new Error("Task ID is required for update");
    }

    await connectDB();
    const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true }).lean();

    if (!updatedTask) {
      throw new Error("Task not found");
    }

    return JSON.parse(JSON.stringify(updatedTask)); // Ensure JSON serialization for API consumption
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task"); // Throw error for proper error handling
  }
};

// Delete task
export const deleteTask = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Task ID is required for deletion");
    }

    await connectDB();
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      throw new Error("Task not found");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task"); // Throw error for proper error handling
  }
};
