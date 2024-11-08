import React, { useState } from "react";

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [taskDates, setTaskDates] = useState({
    startDateTime: "",
    endDateTime: "",
  });

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskItem = {
        text: newTask.trim(),
        startDateTime: taskDates.startDateTime,
        endDateTime: taskDates.endDateTime,
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask("");
      setTaskDates({ startDateTime: "", endDateTime: "" });
      setShowForm(false);
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    const updatedCompletedTasks = completedTasks.filter((i) => i !== index);
    setTasks(updatedTasks);
    setCompletedTasks(updatedCompletedTasks);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowForm(true);
    }
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
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${month} ${day}, ${time}`;
  };

  return (
    <div className="todo-container animate-scale-in">
      <h2 className="title animate-bounce-in">To-Do List</h2>
      <div className="input-section animate-slide-down">
        <div className="input-container">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task"
            className="animate-fade-in"
          />
          <button
            onClick={() => setShowForm(true)}
            className="add-button animate-pulse"
          >
            Add Task
          </button>
        </div>

        {showForm && (
          <div className="date-form animate-slide-down">
            <div className="date-inputs">
              <div className="date-field">
                <label>Start Date and Time:</label>
                <input
                  type="datetime-local"
                  value={taskDates.startDateTime}
                  onChange={(e) =>
                    setTaskDates({ ...taskDates, startDateTime: e.target.value })
                  }
                  placeholder="Select start date and time"
                />
                <span className="date-hint">Format: Month Day, HH:MM AM/PM</span>
              </div>
              <div className="date-field">
                <label>End Date and Time:</label>
                <input
                  type="datetime-local"
                  value={taskDates.endDateTime}
                  onChange={(e) =>
                    setTaskDates({ ...taskDates, endDateTime: e.target.value })
                  }
                  placeholder="Select end date and time"
                />
                <span className="date-hint">Format: Month Day, HH:MM AM/PM</span>
              </div>
            </div>
            <div className="form-buttons">
              <button onClick={handleAddTask} className="confirm-button">
                Confirm
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`task-item animate-slide-in ${
              completedTasks.includes(index) ? "completed" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="task-content">
              <input
                type="checkbox"
                checked={completedTasks.includes(index)}
                onChange={() => toggleTaskCompletion(index)}
                className="task-checkbox"
              />
              <div className="task-details">
                <span className="task-text">{task.text}</span>
                <div className="task-dates">
                  <span className="date-label">Start: {formatDateTime(task.startDateTime)}</span>
                  <span className="date-label">Due: {formatDateTime(task.endDateTime)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDeleteTask(index)}
              className="delete-button animate-shake-hover"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDo;