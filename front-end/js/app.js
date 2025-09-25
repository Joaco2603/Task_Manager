// app.js - Controlador principal para Task Manager
class App {
    constructor() {
        this.taskManager = new TaskManager();
        this.init();
    }
    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
        console.log('Task Manager iniciado correctamente');
    }
    bindEvents() {
        const taskForm = document.getElementById('task-form');
        taskForm.addEventListener('submit', (e) => this.handleCreateTask(e));
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
        const searchInput = document.getElementById('search-input');
        const debouncedSearch = Utils.debounce((e) => this.handleSearch(e), 300);
        searchInput.addEventListener('input', debouncedSearch);
        const taskList = document.getElementById('task-list');
        taskList.addEventListener('click', (e) => this.handleTaskAction(e));
        taskList.addEventListener('change', (e) => this.handleTaskToggle(e));
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    handleCreateTask(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            dueDate: formData.get('date') || null
        };
        if (!taskData.title.trim()) {
            Utils.showToast('El título de la tarea es obligatorio', 'error');
            return;
        }
        const newTask = this.taskManager.createTask(taskData);
        if (newTask) {
            Utils.showToast('Tarea creada exitosamente', 'success');
            this.render();
            this.updateStats();
            e.target.reset();
        } else {
            Utils.showToast('Error al crear la tarea', 'error');
        }
    }
    handleFilterChange(e) {
        const filter = e.target.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        this.taskManager.setFilter(filter);
        this.render();
    }
    handleSearch(e) {
        const searchTerm = e.target.value;
        this.taskManager.setSearchTerm(searchTerm);
        this.render();
    }
    handleTaskAction(e) {
        if (e.target.classList.contains('edit-btn')) {
            const taskId = e.target.closest('.task-item').dataset.taskId;
            this.editTask(taskId);
        } else if (e.target.classList.contains('delete-btn')) {
            const taskId = e.target.closest('.task-item').dataset.taskId;
            this.deleteTask(taskId);
        }
    }
    handleTaskToggle(e) {
        if (e.target.type === 'checkbox') {
            const taskId = e.target.closest('.task-item').dataset.taskId;
            const isCompleted = e.target.checked;
            if (isCompleted) {
                this.taskManager.markAsCompleted(taskId);
                Utils.showToast('Tarea completada', 'success');
            } else {
                this.taskManager.markAsPending(taskId);
                Utils.showToast('Tarea reactivada', 'info');
            }
            this.render();
            this.updateStats();
        }
    }
    editTask(taskId) {
        const task = this.taskManager.getTaskById(taskId);
        if (!task) return;
        const newTitle = prompt('Editar título:', task.title);
        if (newTitle && newTitle.trim() !== task.title) {
            this.taskManager.updateTask(taskId, { title: newTitle.trim() });
            Utils.showToast('Tarea actualizada', 'success');
            this.render();
        }
    }
    deleteTask(taskId) {
        const task = this.taskManager.getTaskById(taskId);
        if (!task) return;
        if (Utils.confirmAction(`¿Eliminar la tarea "${task.title}"?`)) {
            if (this.taskManager.deleteTask(taskId)) {
                Utils.showToast('Tarea eliminada', 'info');
                this.render();
                this.updateStats();
            }
        }
    }
    handleKeyboardShortcuts(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.getElementById('task-title').focus();
        }
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('search-input');
            if (searchInput.value) {
                searchInput.value = '';
                this.taskManager.setSearchTerm('');
                this.render();
            }
        }
    }
    render() {
        const taskList = document.getElementById('task-list');
        const emptyState = document.getElementById('empty-state');
        const tasks = this.taskManager.getFilteredTasks();
        if (tasks.length === 0) {
            taskList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        taskList.style.display = 'block';
        emptyState.style.display = 'none';
        taskList.innerHTML = tasks.map(task => this.renderTaskItem(task)).join('');
    }
    renderTaskItem(task) {
        const isOverdue = task.dueDate && Utils.isOverdue(task.dueDate);
        const overdueClass = isOverdue && task.status === 'pending' ? 'overdue' : '';
        return `
            <li class="task-item ${task.status} ${task.priority} ${overdueClass}" data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-main">
                        <input type="checkbox" ${task.status === 'completed' ? 'checked' : ''}>
                        <div class="task-info">
                            <h3 class="task-title">${Utils.escapeHtml(task.title)}</h3>
                            ${task.description ? `<p class="task-description">${Utils.escapeHtml(task.description)}</p>` : ''}
                            <div class="task-meta">
                                <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                                ${task.dueDate ? `<span class="task-due-date ${isOverdue ? 'overdue' : ''}">${Utils.formatDate(task.dueDate)}</span>` : ''}
                                <span class="task-created">Creada ${Utils.formatRelativeDate(task.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn" title="Editar tarea">✏️</button>
                        <button class="delete-btn" title="Eliminar tarea">🗑️</button>
                    </div>
                </div>
            </li>
        `;
    }
    updateStats() {
        const stats = this.taskManager.getStats();
        document.getElementById('total-tasks').textContent = `${stats.total} tareas`;
        document.getElementById('completed-tasks').textContent = `${stats.completed} completadas`;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.taskApp = new App();
});
