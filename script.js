const API_URL = 'http://localhost:5001/api/tasks';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();

        taskList.innerHTML = '';
        tasks.forEach(task => renderTaskInDOM(task));
    } catch(error) {
        console.error('Error fetching tasks:', error);
    }
}

function renderTaskInDOM(task) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = task.title;
    if(task.completed) {
        span.classList.add('completed');
    }

    span.addEventListener('click', async function() {
        const isNowCompleted = span.classList.toggle('completed');

        try {
            await fetch(`${API_URL}/{task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({completed: isNowCompleted}),
            });
        } catch(error) {
            console.error('Error updating task status:', error);
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', async function() {
        try {
            await fetch(`${API_URL}/${task.id}`, {
                method: 'Delete',
            });
            taskList.removeChild(li);
        } catch(error) {
            console.error('Error deleting task:', error);
        }
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}
addBtn.addEventListener('click', async function() {
    const taskText = taskInput.value.trim();

    if(taskText===''){
        alert('Please enter a task!');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: taskText}),
        });

        const newTask = await response.json();
        renderTaskInDOM(newTask);
        taskInput.value = '';
    } catch(error) {
        console.error('Error adding task:', error);
    }
});
fetchTasks();
