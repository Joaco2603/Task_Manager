# Arquitectura del Sistema
**Task Manager - Aplicación de Gestión de Tareas**

---

## 1. Visión General de la Arquitectura

Task Manager utilizará una arquitectura **Frontend-Only** simple y eficiente, basada en tecnologías web estándar (HTML, CSS y JavaScript vanilla) con almacenamiento local en el navegador. Esta aproximación garantiza simplicidad, facilidad de mantenimiento y despliegue directo.

### Principios Arquitectónicos
- **Simplicidad**: Código limpio y fácil de entender
- **Separación de Responsabilidades**: HTML para estructura, CSS para presentación, JS para lógica
- **Persistencia Local**: Uso de localStorage para mantener datos
- **Responsive Design**: Adaptable a diferentes dispositivos
- **Progressive Enhancement**: Funcionalidad básica sin JavaScript, mejorada con JS

## 2. Estructura del Proyecto Frontend

### 2.1 Arquitectura de Archivos

```
task-manager/
├── index.html              # Página principal
├── css/
│   ├── styles.css         # Estilos principales
│   ├── responsive.css     # Estilos responsive
│   └── themes.css         # Temas opcionales
├── js/
│   ├── app.js            # Lógica principal de la aplicación
│   ├── storage.js        # Manejo de localStorage
│   ├── taskManager.js    # Gestión de tareas
│   └── utils.js          # Funciones utilitarias
├── assets/
│   ├── icons/            # Iconos SVG
│   └── images/           # Imágenes del proyecto
└── README.md             # Documentación del proyecto
```

### 2.2 Estructura HTML Base

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <header class="header">
        <h1>Task Manager</h1>
        <div class="stats">
            <span id="total-tasks">0 tareas</span>
            <span id="completed-tasks">0 completadas</span>
        </div>
    </header>

    <main class="main">
        <section class="task-form-section">
            <form id="task-form" class="task-form">
                <input type="text" id="task-title" placeholder="¿Qué necesitas hacer?" required>
                <textarea id="task-description" placeholder="Descripción (opcional)"></textarea>
                <select id="task-priority">
                    <option value="low">Baja</option>
                    <option value="medium" selected>Media</option>
                    <option value="high">Alta</option>
                </select>
                <input type="date" id="task-date">
                <button type="submit">Agregar Tarea</button>
            </form>
        </section>

        <section class="filters-section">
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">Todas</button>
                <button class="filter-btn" data-filter="pending">Pendientes</button>
                <button class="filter-btn" data-filter="completed">Completadas</button>
            </div>
            <input type="text" id="search-input" placeholder="Buscar tareas...">
        </section>

        <section class="tasks-section">
            <ul id="task-list" class="task-list">
                <!-- Las tareas se generarán dinámicamente -->
            </ul>
            <div id="empty-state" class="empty-state" style="display: none;">
                <p>No tienes tareas aún. ¡Crea tu primera tarea!</p>
            </div>
        </section>
    </main>

    <script src="js/utils.js"></script>
    <script src="js/storage.js"></script>
    <script src="js/taskManager.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### 2.3 Sistema CSS con Variables

```css
:root {
  /* Colores principales */
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  
  /* Colores neutros */
  --background: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  
  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Tipografía */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

## 3. Lógica JavaScript - Arquitectura Modular

### 3.1 Módulo de Almacenamiento (storage.js)

```javascript
// Manejo de localStorage con validación
class StorageManager {
    constructor() {
        this.storageKey = 'taskManager_tasks';
        this.settingsKey = 'taskManager_settings';
    }

    // Obtener todas las tareas
    getTasks() {
        try {
            const tasks = localStorage.getItem(this.storageKey);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            return [];
        }
    }

    // Guardar tareas
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Error al guardar tareas:', error);
            return false;
        }
    }

    // Obtener configuraciones de usuario
    getSettings() {
        try {
            const settings = localStorage.getItem(this.settingsKey);
            return settings ? JSON.parse(settings) : {
                theme: 'light',
                sortBy: 'created',
                showCompleted: true
            };
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            return {};
        }
    }

    // Guardar configuraciones
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            return false;
        }
    }

    // Exportar datos (para backup)
    exportData() {
        return {
            tasks: this.getTasks(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    }

    // Importar datos (desde backup)
    importData(data) {
        try {
            if (data.tasks) this.saveTasks(data.tasks);
            if (data.settings) this.saveSettings(data.settings);
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }
}
```

### 3.2 Gestor de Tareas (taskManager.js)

```javascript
// Clase principal para gestionar tareas
class TaskManager {
    constructor() {
        this.storage = new StorageManager();
        this.tasks = this.storage.getTasks();
        this.currentFilter = 'all';
        this.searchTerm = '';
    }

    // Generar ID único para nueva tarea
    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Crear nueva tarea
    createTask(taskData) {
        const newTask = {
            id: this.generateId(),
            title: taskData.title.trim(),
            description: taskData.description?.trim() || '',
            priority: taskData.priority || 'medium',
            dueDate: taskData.dueDate || null,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(newTask); // Agregar al principio
        this.saveTasks();
        return newTask;
    }

    // Obtener tarea por ID
    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    // Actualizar tarea
    updateTask(taskId, updateData) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return null;

        const updatedTask = {
            ...this.tasks[taskIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        this.tasks[taskIndex] = updatedTask;
        this.saveTasks();
        return updatedTask;
    }

    // Marcar tarea como completada
    markAsCompleted(taskId) {
        return this.updateTask(taskId, {
            status: 'completed',
            completedAt: new Date().toISOString()
        });
    }

    // Marcar tarea como pendiente
    markAsPending(taskId) {
        return this.updateTask(taskId, {
            status: 'pending',
            completedAt: null
        });
    }

    // Eliminar tarea
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return false;

        this.tasks.splice(taskIndex, 1);
        this.saveTasks();
        return true;
    }

    // Filtrar tareas
    getFilteredTasks() {
        let filteredTasks = [...this.tasks];

        // Aplicar filtro de estado
        if (this.currentFilter === 'pending') {
            filteredTasks = filteredTasks.filter(task => task.status === 'pending');
        } else if (this.currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.status === 'completed');
        }

        // Aplicar búsqueda
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower)
            );
        }

        return filteredTasks;
    }

    // Obtener estadísticas
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.status === 'completed').length;
        const pending = total - completed;

        return { total, completed, pending };
    }

    // Guardar tareas en storage
    saveTasks() {
        return this.storage.saveTasks(this.tasks);
    }

    // Establecer filtro
    setFilter(filter) {
        this.currentFilter = filter;
    }

    // Establecer término de búsqueda
    setSearchTerm(term) {
        this.searchTerm = term.trim();
    }
}
```

### 3.3 Utilidades (utils.js)

```javascript
// Funciones utilitarias para la aplicación
const Utils = {
    // Formatear fecha
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Formatear fecha relativa (hace X días)
    formatRelativeDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
        return this.formatDate(dateString);
    },

    // Validar si una fecha está vencida
    isOverdue(dateString) {
        if (!dateString) return false;
        const dueDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    },

    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Debounce function para búsquedas
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Mostrar notificación toast
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    },

    // Confirmar acción
    confirmAction(message) {
        return confirm(message);
    }
};
```

## 4. Controlador Principal de la Aplicación (app.js)

```javascript
// Controlador principal que coordina toda la aplicación
class App {
    constructor() {
        this.taskManager = new TaskManager();
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
        console.log('Task Manager iniciado correctamente');
    }

    // Vincular eventos del DOM
    bindEvents() {
        // Formulario de nueva tarea
        const taskForm = document.getElementById('task-form');
        taskForm.addEventListener('submit', (e) => this.handleCreateTask(e));

        // Botones de filtro
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });

        // Campo de búsqueda con debounce
        const searchInput = document.getElementById('search-input');
        const debouncedSearch = Utils.debounce((e) => this.handleSearch(e), 300);
        searchInput.addEventListener('input', debouncedSearch);

        // Delegación de eventos para botones de tareas
        const taskList = document.getElementById('task-list');
        taskList.addEventListener('click', (e) => this.handleTaskAction(e));
        taskList.addEventListener('change', (e) => this.handleTaskToggle(e));

        // Atajos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    // Manejar creación de nueva tarea
    handleCreateTask(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            dueDate: formData.get('date') || null
        };

        // Validación básica
        if (!taskData.title.trim()) {
            Utils.showToast('El título de la tarea es obligatorio', 'error');
            return;
        }

        const newTask = this.taskManager.createTask(taskData);
        if (newTask) {
            Utils.showToast('Tarea creada exitosamente', 'success');
            this.render();
            this.updateStats();
            e.target.reset(); // Limpiar formulario
        } else {
            Utils.showToast('Error al crear la tarea', 'error');
        }
    }

    // Manejar cambio de filtro
    handleFilterChange(e) {
        const filter = e.target.dataset.filter;
        
        // Actualizar botones activos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Aplicar filtro
        this.taskManager.setFilter(filter);
        this.render();
    }

    // Manejar búsqueda
    handleSearch(e) {
        const searchTerm = e.target.value;
        this.taskManager.setSearchTerm(searchTerm);
        this.render();
    }

    // Manejar acciones en tareas (editar, eliminar)
    handleTaskAction(e) {
        if (e.target.classList.contains('edit-btn')) {
            const taskId = e.target.closest('.task-item').dataset.taskId;
            this.editTask(taskId);
        } else if (e.target.classList.contains('delete-btn')) {
            const taskId = e.target.closest('.task-item').dataset.taskId;
            this.deleteTask(taskId);
        }
    }

    // Manejar toggle de completado
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

    // Editar tarea (implementación simple con prompt)
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

    // Eliminar tarea
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

    // Atajos de teclado
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + N: Enfocar campo de nueva tarea
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.getElementById('task-title').focus();
        }
        
        // Escape: Limpiar búsqueda
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('search-input');
            if (searchInput.value) {
                searchInput.value = '';
                this.taskManager.setSearchTerm('');
                this.render();
            }
        }
    }

    // Renderizar lista de tareas
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

    // Renderizar item individual de tarea
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

    // Actualizar estadísticas
    updateStats() {
        const stats = this.taskManager.getStats();
        document.getElementById('total-tasks').textContent = `${stats.total} tareas`;
        document.getElementById('completed-tasks').textContent = `${stats.completed} completadas`;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.taskApp = new App();
});
```

## 5. Estilos CSS Responsive

### 5.1 Estilos Base (styles.css)

```css
/* Reset y base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--background);
}

/* Layout principal */
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.header h1 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--primary-color);
}

.stats {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.main {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* Formulario de tareas */
.task-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.task-form input,
.task-form textarea,
.task-form select {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-md);
  transition: border-color 0.2s ease;
}

.task-form input:focus,
.task-form textarea:focus,
.task-form select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.task-form button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 6px;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.task-form button:hover {
  background: var(--primary-dark);
}

/* Filtros */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.filter-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.filter-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

#search-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border);
  border-radius: 6px;
  width: 200px;
}

/* Lista de tareas */
.task-list {
  list-style: none;
}

.task-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.task-item.completed {
  opacity: 0.7;
}

.task-item.completed .task-title {
  text-decoration: line-through;
}

.task-item.overdue {
  border-left: 4px solid var(--danger-color);
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-lg);
}

.task-main {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  flex: 1;
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.task-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.task-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.task-priority {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.priority-high {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.priority-medium {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.priority-low {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.task-due-date.overdue {
  color: var(--danger-color);
  font-weight: 600;
}

.task-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  padding: var(--spacing-sm);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-btn:hover {
  background: rgba(37, 99, 235, 0.1);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
}

/* Toast notifications */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 6px;
  color: white;
  font-weight: 500;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.toast.show {
  transform: translateX(0);
}

.toast-success {
  background: var(--success-color);
}

.toast-error {
  background: var(--danger-color);
}

.toast-info {
  background: var(--primary-color);
}
```

### 5.2 Responsive Design (responsive.css)

```css
/* Tablet */
@media (max-width: 768px) {
  .main {
    padding: var(--spacing-md);
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
  
  #search-input {
    width: 100%;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .stats {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .task-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .task-actions {
    align-self: flex-end;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .header {
    padding: var(--spacing-md);
  }
  
  .main {
    padding: var(--spacing-sm);
  }
  
  .task-form {
    padding: var(--spacing-md);
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .task-meta {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .toast {
    right: 10px;
    left: 10px;
    transform: translateY(-100%);
  }
  
  .toast.show {
    transform: translateY(0);
  }
}
```

## 6. Deployment y Hosting

### 6.1 Opciones de Hosting Simples

#### **Hosting Estático Gratuito**
- **GitHub Pages**: Ideal para proyectos open source
- **Netlify**: Deploy automático desde Git con formularios
- **Vercel**: Optimizado para frontend con CDN global
- **Firebase Hosting**: Integración con otros servicios de Google

#### **Estructura para Deployment**
```
task-manager/
├── index.html
├── css/
├── js/
├── assets/
├── manifest.json          # Para PWA
├── sw.js                 # Service Worker
└── .gitignore
```

### 6.2 Progressive Web App (PWA)

#### **Manifest.json**
```json
{
  "name": "Task Manager",
  "short_name": "TaskManager",
  "description": "Aplicación simple para gestionar tareas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### **Service Worker Básico (sw.js)**
```javascript
const CACHE_NAME = 'task-manager-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/taskManager.js',
  '/js/storage.js',
  '/js/utils.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

---

## 7. Seguridad Frontend

### 7.1 Validación y Sanitización

#### **Prevención XSS**
```javascript
// Ya implementado en utils.js
Utils.escapeHtml = function(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Validación de entrada
function validateTaskInput(input) {
  const validation = {
    title: {
      required: true,
      maxLength: 200,
      pattern: /^[^<>]*$/  // No permitir < >
    },
    description: {
      maxLength: 1000,
      pattern: /^[^<>]*$/
    }
  };
  
  return Object.keys(validation).every(field => {
    const rules = validation[field];
    const value = input[field];
    
    if (rules.required && !value?.trim()) return false;
    if (rules.maxLength && value?.length > rules.maxLength) return false;
    if (rules.pattern && !rules.pattern.test(value || '')) return false;
    
    return true;
  });
}
```

### 7.2 Gestión Segura de LocalStorage

```javascript
// Encriptación básica de datos (opcional)
class SecureStorage {
  constructor(key = 'taskManager') {
    this.key = key;
    this.secretKey = this.generateKey();
  }
  
  // Generar clave basada en el navegador
  generateKey() {
    const userAgent = navigator.userAgent;
    const screen = `${screen.width}x${screen.height}`;
    return btoa(userAgent + screen).slice(0, 16);
  }
  
  // Encriptación simple (XOR)
  encrypt(text) {
    return text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.secretKey.charCodeAt(i % this.secretKey.length))
    ).join('');
  }
  
  decrypt(encryptedText) {
    return this.encrypt(encryptedText); // XOR es simétrico
  }
  
  setItem(key, value) {
    const encrypted = this.encrypt(JSON.stringify(value));
    localStorage.setItem(`${this.key}_${key}`, encrypted);
  }
  
  getItem(key) {
    const encrypted = localStorage.getItem(`${this.key}_${key}`);
    if (!encrypted) return null;
    
    try {
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error al desencriptar datos:', error);
      return null;
    }
  }
}
```

---

## 8. Optimización y Performance

### 8.1 Técnicas de Optimización

#### **Lazy Loading de Imágenes**
```javascript
// Observer para lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

// Aplicar a todas las imágenes lazy
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

#### **Optimización de Rendering**
```javascript
// Virtual scrolling para listas grandes
class VirtualList {
  constructor(container, itemHeight, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2;
    this.scrollTop = 0;
    
    this.container.addEventListener('scroll', () => this.handleScroll());
  }
  
  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.render();
  }
  
  render(items) {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(startIndex + this.visibleItems, items.length);
    
    const visibleItems = items.slice(startIndex, endIndex);
    
    this.container.innerHTML = visibleItems
      .map((item, index) => this.renderItem(item, startIndex + index))
      .join('');
      
    this.container.style.paddingTop = `${startIndex * this.itemHeight}px`;
    this.container.style.paddingBottom = `${(items.length - endIndex) * this.itemHeight}px`;
  }
}
```

### 8.2 Métricas y Monitoring

#### **Performance Monitoring**
```javascript
// Monitoring básico de performance
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.startTimes = {};
  }
  
  startTimer(name) {
    this.startTimes[name] = performance.now();
  }
  
  endTimer(name) {
    if (!this.startTimes[name]) return;
    
    const duration = performance.now() - this.startTimes[name];
    this.metrics[name] = (this.metrics[name] || []).concat(duration);
    delete this.startTimes[name];
    
    // Log si la operación es lenta
    if (duration > 100) {
      console.warn(`Operación lenta detectada: ${name} (${duration.toFixed(2)}ms)`);
    }
  }
  
  getAverageTime(name) {
    const times = this.metrics[name] || [];
    return times.length ? times.reduce((a, b) => a + b) / times.length : 0;
  }
  
  logReport() {
    console.log('Performance Report:', 
      Object.keys(this.metrics).map(name => ({
        operation: name,
        averageTime: `${this.getAverageTime(name).toFixed(2)}ms`,
        calls: this.metrics[name].length
      }))
    );
  }
}

// Uso del monitor
const perfMonitor = new PerformanceMonitor();

// En taskManager.js
createTask(taskData) {
  perfMonitor.startTimer('createTask');
  const result = this.createTask(taskData);
  perfMonitor.endTimer('createTask');
  return result;
}
```

---

## 9. Testing y Validación

### 9.1 Testing Manual

#### **Checklist de Funcionalidades**
- [ ] Crear tarea con título válido
- [ ] Validación de campos obligatorios
- [ ] Marcar tarea como completada/pendiente
- [ ] Editar título de tarea existente
- [ ] Eliminar tarea con confirmación
- [ ] Filtrar por estado (todas, pendientes, completadas)
- [ ] Búsqueda por texto en tiempo real
- [ ] Persistencia en localStorage
- [ ] Responsive design en móvil/tablet
- [ ] Atajos de teclado

#### **Casos de Edge**
- [ ] Título muy largo (>200 caracteres)
- [ ] Caracteres especiales y emojis
- [ ] LocalStorage lleno
- [ ] JavaScript deshabilitado
- [ ] Conexión lenta/intermitente

### 9.2 Testing Automatizado Básico

#### **Tests Unitarios Simples**
```javascript
// test.js - Tests básicos sin framework
class SimpleTest {
  static test(name, fn) {
    try {
      fn();
      console.log(`✅ ${name}`);
    } catch (error) {
      console.error(`❌ ${name}: ${error.message}`);
    }
  }
  
  static assertEqual(actual, expected) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  }
  
  static assertTrue(condition) {
    if (!condition) {
      throw new Error('Expected true, got false');
    }
  }
}

// Tests de TaskManager
SimpleTest.test('TaskManager debe crear tarea correctamente', () => {
  const taskManager = new TaskManager();
  const initialCount = taskManager.tasks.length;
  
  const newTask = taskManager.createTask({
    title: 'Test task',
    priority: 'high'
  });
  
  SimpleTest.assertTrue(newTask !== null);
  SimpleTest.assertEqual(taskManager.tasks.length, initialCount + 1);
  SimpleTest.assertEqual(newTask.title, 'Test task');
  SimpleTest.assertEqual(newTask.priority, 'high');
  SimpleTest.assertEqual(newTask.status, 'pending');
});

SimpleTest.test('TaskManager debe marcar tarea como completada', () => {
  const taskManager = new TaskManager();
  const task = taskManager.createTask({ title: 'Test' });
  
  const completedTask = taskManager.markAsCompleted(task.id);
  
  SimpleTest.assertEqual(completedTask.status, 'completed');
  SimpleTest.assertTrue(completedTask.completedAt !== null);
});

// Ejecutar tests
console.log('Ejecutando tests...');
// Los tests se ejecutarían aquí
```

---

## 10. Roadmap y Mejoras Futuras

### Fase 1: MVP (Semanas 1-2) ✅
- [x] Estructura HTML básica
- [x] Estilos CSS responsive
- [x] JavaScript vanilla funcional
- [x] LocalStorage para persistencia
- [x] CRUD completo de tareas

### Fase 2: UX Mejorada (Semanas 3-4)
- [ ] Animaciones CSS
- [ ] Drag & drop para reordenar
- [ ] Temas claro/oscuro
- [ ] Exportar/importar datos
- [ ] Categorías/etiquetas

### Fase 3: PWA (Semanas 5-6)
- [ ] Service Worker
- [ ] Manifest.json
- [ ] Instalación en móvil
- [ ] Notificaciones push
- [ ] Modo offline completo

### Fase 4: Características Avanzadas (Futuro)
- [ ] Sincronización en la nube (Firebase/Supabase)
- [ ] Colaboración en tiempo real
- [ ] Recordatorios inteligentes
- [ ] Analytics de productividad
- [ ] Integración con calendarios

---

*Documento versión 2.0 - Frontend Only - Septiembre 2025*
