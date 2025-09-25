// taskManager.js - Gestión de tareas para Task Manager
class TaskManager {
    constructor() {
        this.storage = new StorageManager();
        this.tasks = this.storage.getTasks();
        this.currentFilter = 'all';
        this.searchTerm = '';
    }
    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
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
        this.tasks.unshift(newTask);
        this.saveTasks();
        return newTask;
    }
    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }
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
    markAsCompleted(taskId) {
        return this.updateTask(taskId, {
            status: 'completed',
            completedAt: new Date().toISOString()
        });
    }
    markAsPending(taskId) {
        return this.updateTask(taskId, {
            status: 'pending',
            completedAt: null
        });
    }
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return false;
        this.tasks.splice(taskIndex, 1);
        this.saveTasks();
        return true;
    }
    getFilteredTasks() {
        let filteredTasks = [...this.tasks];
        if (this.currentFilter === 'pending') {
            filteredTasks = filteredTasks.filter(task => task.status === 'pending');
        } else if (this.currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.status === 'completed');
        }
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower)
            );
        }
        return filteredTasks;
    }
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.status === 'completed').length;
        const pending = total - completed;
        return { total, completed, pending };
    }
    saveTasks() {
        return this.storage.saveTasks(this.tasks);
    }
    setFilter(filter) {
        this.currentFilter = filter;
    }
    setSearchTerm(term) {
        this.searchTerm = term.trim();
    }
}
