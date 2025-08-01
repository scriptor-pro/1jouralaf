import React, { useState, useEffect } from 'react';
import './styles/tasks.css';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(stored);
  }, []);

  const handleTaskAdded = (newList) => {
    setTasks(newList);
  };

  const handleDelete = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  return (
    <section aria-labelledby="task-list-title">
      <h2 id="task-list-title">Tâches du jour</h2>
      <TaskInput onTaskAdded={handleTaskAdded} />
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id}>
            <div className="task-item">
              <strong>{task.title}</strong>
              {task.start && <span>{task.start}</span>}
              <span>{task.duration} min</span>
              <button
                onClick={() => handleDelete(task.id)}
                aria-label={`Supprimer la tâche ${task.title}`}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && <li>Aucune tâche pour l’instant.</li>}
      </ul>
    </section>
  );
}

import TaskInput from './TaskInput';
