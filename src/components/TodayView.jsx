import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import './styles/today.css';

function formatDateToFr(isoDateStr) {
  const [year, month, day] = isoDateStr.split('-');
  return `${day}-${month}-${year}`;
}

function sortTasksByTime(tasks) {
  return tasks.sort((a, b) => {
    if (!a.start) return 1;
    if (!b.start) return -1;
    return a.start.localeCompare(b.start);
  });
}

export default function TodayView() {
  const [tasks, setTasks] = useState([]);
  const todayISO = new Date().toISOString().split('T')[0];
  const todayFormatted = formatDateToFr(todayISO);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tasks')) || [];
    const todayTasks = stored.filter(t => t.date === todayISO);
    setTasks(sortTasksByTime(todayTasks));
  }, []);

  const handleTaskAdded = (updatedList) => {
    const todayTasks = updatedList.filter(t => t.date === todayISO);
    setTasks(sortTasksByTime(todayTasks));
  };

  return (
    <main className="today-view" aria-label="Planning d'aujourd'hui">
      <h1>Planning du jour : {todayFormatted}</h1>

      <TaskInput onTaskAdded={handleTaskAdded} />

      <div className="agenda-grid" aria-label="Liste des tâches">
        {tasks.length === 0 && (
          <p className="no-task">Aucune tâche prévue pour aujourd’hui.</p>
        )}

        {tasks.map(task => (
          <div className="task-block" key={task.id}>
            <div className="time-label">{task.start || '--:--'}</div>
            <div className="task-content">
              <strong>{task.title}</strong>
              <span>{task.duration} min</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
