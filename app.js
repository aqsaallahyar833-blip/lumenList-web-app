const STORAGE_KEY = 'lumenlist-app-v1';
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const remainingCount = document.getElementById('remaining-count');
const clearAllButton = document.getElementById('clear-all');
const template = document.getElementById('todo-item-template');

let todos = loadTodos();
renderTodos();

form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();

    if (!text) {
        input.value = '';
        return;
    }

    todos.push({
        id: Date.now().toString(),
        text,
        completed: false,
    });

    input.value = '';
    saveTodos();
    renderTodos();
});

clearAllButton.addEventListener('click', () => {
    if (!todos.length) return;
    todos = [];
    saveTodos();
    renderTodos();
});

function createTodoItem(todo) {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector('li');
    const textElement = fragment.querySelector('.todo-text');
    const editInput = fragment.querySelector('.todo-edit');
    const checkbox = fragment.querySelector('.toggle-complete');
    const editButton = fragment.querySelector('.edit-button');
    const deleteButton = fragment.querySelector('.delete-button');

    textElement.textContent = todo.text;
    editInput.value = todo.text;
    checkbox.checked = todo.completed;

    if (todo.completed) {
        textElement.classList.add('completed');
    }

    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        saveTodos();
        renderTodos();
    });

    editButton.addEventListener('click', () => {
        item.classList.toggle('editing');
        if (item.classList.contains('editing')) {
            editInput.focus();
            editInput.setSelectionRange(editInput.value.length, editInput.value.length);
        } else {
            commitEdit();
        }
    });

    editInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            commitEdit();
        }
        if (event.key === 'Escape') {
            editInput.value = todo.text;
            item.classList.remove('editing');
        }
    });

    editInput.addEventListener('blur', () => {
        if (item.classList.contains('editing')) {
            commitEdit();
        }
    });

    deleteButton.addEventListener('click', () => {
        todos = todos.filter(current => current.id !== todo.id);
        saveTodos();
        renderTodos();
    });

    function commitEdit() {
        const newText = editInput.value.trim();
        if (newText) {
            todo.text = newText;
        }
        item.classList.remove('editing');
        saveTodos();
        renderTodos();
    }

    return fragment;
}

function renderTodos() {
    list.innerHTML = '';
    todos.forEach(todo => list.appendChild(createTodoItem(todo)));
    remainingCount.textContent = todos.filter(todo => !todo.completed).length;
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load todos from storage', error);
        return [];
    }
}
