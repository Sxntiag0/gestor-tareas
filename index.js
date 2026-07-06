const API_URL = 'http://localhost:3000/api/tasks';
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');


document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    try {
        const res = await fetch(API_URL);
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error al cargar las tareas:", error);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.status === 'completada' ? 'completada' : ''}`;
        
        div.innerHTML = `
            <span>${task.title}</span>
            <div>
                <button onclick="toggleStatus(${task.id}, '${task.status}', '${task.title}')">
                    ${task.status === 'completada' ? 'Deshacer' : 'Completar'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(div);
    });
}


taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('taskTitle');
    
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleInput.value, description: '' })
    });
    
    titleInput.value = '';
    fetchTasks(); // Recargar la lista
});


async function toggleStatus(id, currentStatus, title) {
    const newStatus = currentStatus === 'completada' ? 'pendiente' : 'completada';
    
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: '', status: newStatus })
    });
    fetchTasks();
}


async function deleteTask(id) {
    if(confirm('¿Seguro que deseas eliminar esta tarea?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks();
    }
}