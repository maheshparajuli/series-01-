import React, { useState, useEffect } from "react";

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
  const [filter, setFilter] = useState("all");
  const [priorityOptions] = useState(["Low", "Medium", "High"]);
  const [selectedPriority, setSelectedPriority] = useState("Medium");


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
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = newTaskItem;
        setTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        setTasks([...tasks, newTaskItem]);
      }

      setNewTask("");
      setTaskDates({ startDateTime: "", endDateTime: "" });
      setShowForm(false);
      setSelectedPriority("Medium");
    }
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

  const filteredTasks = tasks.filter((_, index) => {
    switch(filter) {
      case "completed": return completedTasks.includes(index);
      case "active": return !completedTasks.includes(index);
      default: return true;
    }
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="todo-container">
      <h2 className="todo-title">Enhanced Todo List</h2>
      
      <div className="filter-buttons">
        {["all", "active", "completed"].map(filterType => (
          <button 
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`filter-button ${filter === filterType ? 'active' : ''}`}
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
          className="task-input"
        />
        
        <div className="priority-selector">
          {priorityOptions.map(priority => (
            <button
              key={priority}
              onClick={() => setSelectedPriority(priority)}
              className={`priority-button ${selectedPriority === priority ? 'selected' : ''}`}
            >
              {priority} Priority
            </button>
          ))}
        </div>

        <div className="date-inputs">
          <div>
            <label className="date-label">Start Date:</label>
            <input
              type="datetime-local"
              value={taskDates.startDateTime}
              onChange={(e) => setTaskDates({...taskDates, startDateTime: e.target.value})}
              className="date-input"
            />
          </div>
          <div>
            <label className="date-label">End Date:</label>
            <input
              type="datetime-local"
              value={taskDates.endDateTime}
              onChange={(e) => setTaskDates({...taskDates, endDateTime: e.target.value})}
              className="date-input"
            />
          </div>
        </div>

        <button 
          onClick={handleAddTask}
          className="add-task-button"
        >
          {editingIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <ul className="task-list">
        {sortedTasks.map((task, index) => {
          const originalIndex = tasks.indexOf(task);
          return (
            <li 
              key={originalIndex} 
              className={`task-item ${completedTasks.includes(originalIndex) ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={completedTasks.includes(originalIndex)}
                onChange={() => toggleTaskCompletion(originalIndex)}
                className="task-checkbox"
              />
              <div className="task-details">
                <div className={`task-text ${completedTasks.includes(originalIndex) ? 'completed-text' : ''}`}>
                  {task.text}
                </div>
                <div className="task-metadata">
                  <span className={`priority-tag ${task.priority.toLowerCase()}-priority`}>
                    {task.priority} Priority
                  </span>
                  {task.startDateTime && `Start: ${formatDateTime(task.startDateTime)}`}
                  {task.endDateTime && ` | Due: ${formatDateTime(task.endDateTime)}`}
                </div>
              </div>
              <div className="task-actions">
                <button 
                  onClick={() => handleEditTask(originalIndex)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteTask(originalIndex)}
                  className="delete-button"
                >
                  Delete
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