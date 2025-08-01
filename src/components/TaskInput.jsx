import React, { useState, useEffect } from 'react';
import './styles/tasks.css';

export default function TaskInput({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [duration, setDuration] = useState(60); // minutes

  const handleAdd = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title,
      start,
      duration: parseInt(duration),
    };

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = [...storedTasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTitle('');
    setStart('');
    setDuration(60);
    onTaskAdded(updatedTasks);
  };

  return (
    <div className="task-input" role="form" aria-label="Ajouter une tâche">
      <label>
        Tâche *
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          aria-required="true"
        />
      </label>

      <label>
        Heure de début
        <input
          type="time"
          value={start}
          onChange={e => setStart(e.target.value)}
        />
      </label>

      <label>
        Durée (minutes)
        <input
          type="number"
          min="5"
          step="5"
          value={duration}
          onChange={e => setDuration(e.target.value)}
        />
      </label>

      <button onClick={handleAdd} className="task-button">
        Ajouter
      </button>
    </div>
  );
}
