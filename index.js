const API_URL = 'http://localhost:3000/api/tasks';
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');


document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    try {
        // Usamos URLSearchParams para construir la URL correctamente
        const params = new URLSearchParams();
        if (searchInput.value) params.append('search', searchInput.value);
        if (statusFilter.value) params.append('status', statusFilter.value);
        
        // Hacemos la petición con los parámetros concatenados
        const res = await fetch(`${API_URL}?${params.toString()}`);
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error al cargar las tareas:", error);
    }
}


searchInput.addEventListener('input', fetchTasks);
statusFilter.addEventListener('change', fetchTasks);

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.status === 'completada' ? 'completada' : ''}`;
        
        div.innerHTML = `
            <span>${task.title}</span>
            <div>
                <!-- NUEVO BOTÓN DE EDITAR -->
                <button style="background-color: #ffc107; color: black;" onclick="editTask(${task.id}, '${task.title}', '${task.status}')">Editar</button>
                
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


async function editTask(id, currentTitle, currentStatus) {
    
    const newTitle = prompt('Edita el nombre de tu tarea:', currentTitle);

    
    if (!newTitle || newTitle.trim() === '') {
        return; 
    }

    
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title: newTitle, 
            description: '', 
            status: currentStatus 
        })
    });
    
    
    fetchTasks();
}