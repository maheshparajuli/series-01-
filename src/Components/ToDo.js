import React, { useState } from "react";


const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-container">
      <h2 className="fade-in">To-Do List</h2>
      <div className="input-container fade-in">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask} className="slide-in-right">
          Add Task
        </button>
      </div>
      <ul className="fade-in">
        {tasks.map((task, index) => (
          <li key={index} className="task slide-in-left">
            {task}
            <button onClick={() => handleDeleteTask(index)} className="slide-in-right">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDo;