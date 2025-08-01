export function TaskInput(onTaskAdded) {
  const wrapper = document.createElement('div');
  wrapper.className = 'task-input';
  wrapper.setAttribute('role', 'form');
  wrapper.setAttribute('aria-label', 'Ajouter une tâche');

  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Tâche *';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.required = true;

  const timeLabel = document.createElement('label');
  timeLabel.textContent = 'Heure de début';
  const timeInput = document.createElement('input');
  timeInput.type = 'time';

  const durationLabel = document.createElement('label');
  durationLabel.textContent = 'Durée (minutes)';
  const durationInput = document.createElement('input');
  durationInput.type = 'number';
  durationInput.min = 5;
  durationInput.step = 5;
  durationInput.value = 60;

  const addButton = document.createElement('button');
  addButton.textContent = 'Ajouter';
  addButton.className = 'task-button';

  addButton.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const start = timeInput.value;
    const duration = parseInt(durationInput.value);

    if (!title) {
      alert('La tâche doit avoir un nom.');
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // format yyyy-mm-dd
    const newTask = {
      id: Date.now(),
      title,
      start,
      duration,
      date: today
    };

    const stored = JSON.parse(localStorage.getItem('tasks')) || [];
    const updated = [...stored, newTask];
    localStorage.setItem('tasks', JSON.stringify(updated));

    titleInput.value = '';
    timeInput.value = '';
    durationInput.value = 60;

    if (typeof onTaskAdded === 'function') {
      onTaskAdded(updated);
    }
  });

  // Regroupement dans le DOM
  wrapper.appendChild(titleLabel);
  wrapper.appendChild(titleInput);
  wrapper.appendChild(timeLabel);
  wrapper.appendChild(timeInput);
  wrapper.appendChild(durationLabel);
  wrapper.appendChild(durationInput);
  wrapper.appendChild(addButton);

  return wrapper;
}
