import React, { useState } from "react";

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
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
      handleAddTask();
    }
  };

  const toggleTaskCompletion = (index) => {
    if (completedTasks.includes(index)) {
      setCompletedTasks(completedTasks.filter((i) => i !== index));
    } else {
      setCompletedTasks([...completedTasks, index]);
    }
  };

  return (
    <div className="todo-container animate-scale-in">
      <h2 className="title animate-bounce-in">To-Do List</h2>
      <div className="input-container animate-slide-down">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task"
          className="animate-fade-in"
        />
        <button 
          onClick={handleAddTask} 
          className="add-button animate-pulse"
        >
          Add Task
        </button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li 
            key={index} 
            className={`task-item animate-slide-in ${completedTasks.includes(index) ? 'completed' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="task-content">
              <input
                type="checkbox"
                checked={completedTasks.includes(index)}
                onChange={() => toggleTaskCompletion(index)}
                className="task-checkbox"
              />
              <span className="task-text">{task}</span>
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