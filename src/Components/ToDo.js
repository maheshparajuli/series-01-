import React, { useState, useEffect } from "react";
import { Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [taskDates, setTaskDates] = useState({
    startDateTime: "",
    endDateTime: "",
  });
  const [filter, setFilter] = useState("all"); // New filter state
  const [priorityOptions] = useState(["Low", "Medium", "High"]); // Priority options
  const [selectedPriority, setSelectedPriority] = useState("Medium"); // Default priority

  // Local storage integration
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    setTasks(savedTasks);
    setCompletedTasks(savedCompletedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskItem = {
        text: newTask.trim(),
        startDateTime: taskDates.startDateTime,
        endDateTime: taskDates.endDateTime,
        priority: selectedPriority,
        createdAt: new Date().toISOString()
      };

      if (editingIndex !== null) {
        // Update existing task
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = newTaskItem;
        setTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        // Add new task
        setTasks([...tasks, newTaskItem]);
      }

      // Reset form
      setNewTask("");
      setTaskDates({ startDateTime: "", endDateTime: "" });
      setShowForm(false);
      setSelectedPriority("Medium");
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setNewTask(taskToEdit.text);
    setTaskDates({
      startDateTime: taskToEdit.startDateTime,
      endDateTime: taskToEdit.endDateTime
    });
    setSelectedPriority(taskToEdit.priority);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    const updatedCompletedTasks = completedTasks.filter((i) => i !== index);
    setTasks(updatedTasks);
    setCompletedTasks(updatedCompletedTasks);
  };

  const toggleTaskCompletion = (index) => {
    if (completedTasks.includes(index)) {
      setCompletedTasks(completedTasks.filter((i) => i !== index));
    } else {
      setCompletedTasks([...completedTasks, index]);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((_, index) => {
    switch(filter) {
      case "completed": return completedTasks.includes(index);
      case "active": return !completedTasks.includes(index);
      default: return true;
    }
  });

  // Sorting tasks by priority and creation date
  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="todo-container max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Enhanced Todo List</h2>
      
      {/* Filter Buttons */}
      <div className="filter-buttons flex justify-center space-x-2 mb-4">
        {["all", "active", "completed"].map(filterType => (
          <button 
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 rounded ${
              filter === filterType 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="w-full p-2 border rounded mb-2"
        />
        
        {/* Priority Selector */}
        <div className="priority-selector flex space-x-2 mb-2">
          {priorityOptions.map(priority => (
            <button
              key={priority}
              onClick={() => setSelectedPriority(priority)}
              className={`px-3 py-1 rounded ${
                selectedPriority === priority 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {priority} Priority
            </button>
          ))}
        </div>

        {/* Date Selection Form */}
        <div className="date-inputs grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-sm">Start Date:</label>
            <input
              type="datetime-local"
              value={taskDates.startDateTime}
              onChange={(e) => setTaskDates({...taskDates, startDateTime: e.target.value})}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm">End Date:</label>
            <input
              type="datetime-local"
              value={taskDates.endDateTime}
              onChange={(e) => setTaskDates({...taskDates, endDateTime: e.target.value})}
              className="w-full p-1 border rounded"
            />
          </div>
        </div>

        {/* Add/Update Task Button */}
        <button 
          onClick={handleAddTask}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {editingIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {/* Task List */}
      <ul className="mt-4 space-y-2">
        {sortedTasks.map((task, index) => {
          const originalIndex = tasks.indexOf(task);
          return (
            <li 
              key={originalIndex} 
              className={`flex items-center p-2 rounded ${
                completedTasks.includes(originalIndex) 
                  ? 'bg-green-100' 
                  : 'bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={completedTasks.includes(originalIndex)}
                onChange={() => toggleTaskCompletion(originalIndex)}
                className="mr-2"
              />
              <div className="flex-grow">
                <div className={`${completedTasks.includes(originalIndex) ? 'line-through text-gray-500' : ''}`}>
                  {task.text}
                </div>
                <div className="text-xs text-gray-500">
                  <span className={`mr-2 ${
                    task.priority === 'High' ? 'text-red-500' :
                    task.priority === 'Medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {task.priority} Priority
                  </span>
                  {task.startDateTime && `Start: ${formatDateTime(task.startDateTime)}`}
                  {task.endDateTime && ` | Due: ${formatDateTime(task.endDateTime)}`}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditTask(originalIndex)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteTask(originalIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ToDo;